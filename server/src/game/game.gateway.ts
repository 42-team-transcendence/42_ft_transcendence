//@nestjs/websockets : base package that makes websocket integration possible in NestJS
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    ConnectedSocket,
    WsResponse,
    OnGatewayDisconnect,
    OnGatewayConnection,
  } from '@nestjs/websockets';
//@nestjs/platform-socket.io is the specific package for socket.io integration
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, Socket, ServerOptions } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';

interface Paddle {
    socketId: string | undefined,
    Id: number,
    width: number,
    height: number,
    x: number,
    y: number,
  }

//The WebSocket gateway is responsible for handling WebSocket connections and events in NestJS.
// the OnGatewayInit interface is a part of the WebSockets module.
// It is used to define a lifecycle hook that is triggered when a WebSocket gateway is initialized.
@WebSocketGateway(
  // 4444, //Dès que j'essaie de changer le port j'ai une erreur réseau Connexion refused / CORS
  {
    cors: {
      origin: ["http://localhost:3000"],
      credentials: true,
      cookie: {
        name: "io",
        path: "/",
        httpOnly: true,
        sameSite: "lax"
      }
    },
    path: "/game", //replace http://localhost:3333/socket.io/ with http://localhost:3333/game/
  },
)
export default class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    
  // Déclare une instance du Server de socket.io
  //this allows you to access the WebSocket server instance and utilize its methods,
  //including the emit() method.
  @WebSocketServer() 
  server: Server;

//   private players = []; // Keep track of connected clients
    private players: Paddle[] = [];

  /*-------------------------------------------------------------------------------------------------------------------------------*/

  //lifecycle method : it will be executed automatically (due to OnGatewayInit interface) once the gateway is initialized.
  //This provides an opportunity to perform any necessary 
  //setup or initialization tasks before the WebSocket server starts accepting connections.
  afterInit(server: Server) {
      // Perform initialization tasks here
      console.log('Game WebSocket gateway initialized');
    }

  //lifecycle method : automatically called by NestJS when a new client establishes a WebSocket connection with the server, due to OnGatewayConnection Interface
  handleConnection(
    client: Socket,
  ) {
      console.log("handleConnection")
  }

  //lifecycle method : automaticaly called on socket disconnection
  handleDisconnect(client: Socket) {
    console.log("disconnect")
    
    //Remove socket connection from players list
    const Id = client.handshake.query.Id; // Assuming you pass Id as a query parameter while connecting
    this.players = this.players.filter((e:any) => e.Id != Id);
    console.log(this.players);
  }

  /*-------------------------------------------------------------------------------------------------------------------------------*/

//   Player(paddle: Paddle) {

//   }


heartBeat() {
    if (this.players.length > 1){
        this.server.emit('heartBeat', this.players);
    }
}

intervalID = setInterval(() => {
    this.heartBeat();
}, 500);

  @SubscribeMessage('getCounter')
  getCounter(@ConnectedSocket() client: any) {
        console.log("COUNTER === " + this.players.length);
        client.emit('counter', this.players.length);
  }
  
//   The @SubscribeMessage decorator is used in NestJS WebSocket gateways to indicate 
//   that a particular method should be invoked when a specific WebSocket message is received.
  @SubscribeMessage('playerData')
  handleUserData(
    @MessageBody() data: any, //It instructs NestJS to inject the message body directly into the data parameter.
    @ConnectedSocket() client: any, //By using the @ConnectedSocket decorator, you can access the client's socket connection within a WebSocket gateway method, enabling you to perform client-specific actions or emit messages specifically to that client.
  ): string {

    //Add new socket connection to players list
    let paddle: Paddle;
    paddle = {
        socketId: data.socketId,
        Id: data.Id,
        width: data.width,
        height: data.height,
        x: data.x,
        y: data.y,
    };
    this.players.push(paddle);

    return data;
  }

}