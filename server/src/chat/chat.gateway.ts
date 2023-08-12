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
import { PrismaService } from "src/prisma/prisma.service";

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
    path: "/chat", //replace http://localhost:3333/socket.io/ with http://localhost:3333/chat/
  },
)
export default class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private prisma: PrismaService,
) {}

  // Déclare une instance du Server de socket.io
  //this allows you to access the WebSocket server instance and utilize its methods,
  //including the emit() method.
  @WebSocketServer()
  server: Server;

  private connectedClients = []; // Keep track of connected clients

  //lifecycle method : it will be executed automatically (due to OnGatewayInit interface) once the gateway is initialized.
  //This provides an opportunity to perform any necessary
  //setup or initialization tasks before the WebSocket server starts accepting connections.
  afterInit(server: Server) {
      // Perform initialization tasks here
      console.log('WebSocket gateway initialized!');
    }

  //lifecycle method : automatically called by NestJS when a new client establishes a WebSocket connection with the server, due to OnGatewayConnection Interface
  handleConnection(
    client: Socket,
  ) {
      console.log("handleConnection")
      // console.log({client_handshake : client.handshake});
  }

  //lifecycle method : automaticaly called on socket disconnection
  handleDisconnect(client: Socket) {
    console.log("disconnect")

    //Remove socket connection from connectedClients list
    const userId = client.handshake.query.userId; // Assuming you pass userId as a query parameter while connecting
    this.connectedClients = this.connectedClients.filter((e:any) => e.userId != userId);
    console.log({remainingConnectedClients: this.connectedClients});
  }

  //The @SubscribeMessage decorator is used in NestJS WebSocket gateways to indicate
  //that a particular method should be invoked when a specific WebSocket message is received.
  @SubscribeMessage('userData')
  handleUserData(
    @MessageBody() data: any, //It instructs NestJS to inject the message body directly into the data parameter.
    @ConnectedSocket() client: any, //By using the @ConnectedSocket decorator, you can access the client's socket connection within a WebSocket gateway method, enabling you to perform client-specific actions or emit messages specifically to that client.
  ): string {
    console.log('Received userData:', data);
    console.log({client : client});

    //Add new socket connection to connectedClients list
    this.connectedClients.push({userId : data.userId, socketId : data.socketId});
    console.log({connectedClients: this.connectedClients});

    return data;
  }

  @SubscribeMessage('message')
  async handleChatMessage(
    @MessageBody() data: any, //It instructs NestJS to inject the message body directly into the data parameter.
    @ConnectedSocket() client: any, //By using the @ConnectedSocket decorator, you can access the client's socket connection within a WebSocket gateway method, enabling you to perform client-specific actions or emit messages specifically to that client.
  ) {
    try {
        //store message sent in DB
        const createdMsg = await this.storeMessage(data);
    } catch (error) {
        console.log(error);
        throw error;
    }

    //TODO retrieve recipients from DB with chatId

    // ****** BLOC A MODIFIER : IL FAUT ENVOYER DANS UNE ROOM plutot que cibler un destinataire ******
    //search for the right recipient in connected clients
    const recipient = this.connectedClients.find((e) => e.userId === data.to)
    if (recipient)
      this.sendMessageToClient('message', data.content, recipient.socketId, data.from);
    // ************
  }

  async storeMessage(msg) {
		try {
			//création du msg dans la DB : ajout dans la table et connexion avec le chat et le sender correspondant
			const createdMsg = await this.prisma.message.create({
				data: {
					message: msg.content,
					chat: {connect: {id: msg.chatId}},
					sender: {connect: {id: msg.from}},
				},
				// include: {
				// 	chat: true, // Include chat infos
				// },
			})
      return createdMsg;
		} catch (error) {
        console.log(error);
        throw error;
		}
  }

  // Emit a message to specific socket client id
  sendMessageToClient(event:string, content:string, socketId:string, senderId:number): void {
    this.server.to(socketId).emit(event, { content, senderId });
  }

  broadcastToAll(event:string, message:string): void {
    // Emit a message to all connected clients
    this.server.emit(event, { message: `Hello, clients! message received : ${message}` });
  }

}
