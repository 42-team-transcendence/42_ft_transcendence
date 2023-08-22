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
    score: number,
	  color: string,
  }

  interface Ball {
	X: number;
	Y: number;
  color: string;
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
    private gameWidth = 800; 
	private gameHeight = 400;
	private ballRadius = 12.5;
	private paddleSpeed = 50;
	private ballSpeed = 3;
    private ball: Ball = {
        X: this.gameWidth / 2,
        Y: this.gameHeight / 2,
        color: "orange"
    };
	private ballXDirection = Math.random() < 0.5 ? -1 : 1;
	private ballYDirection = Math.random() < 0.5 ? -1 : 1;

  /*-------------------------------------------------------------------------------------------------------------------------------*/
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
  }

  /*-------------------------------------------------------------------------------------------------------------------------------*/
  /*-------------------------------------------------------------------------------------------------------------------------------*/

heartBeat() {
    if (this.players.length > 1) {
        const gameData = {
            ball: this.ball,
            players: this.players,
        };
        this.server.emit('game', gameData);
        this.moveBall();
        this.checkCollision();
        if (this.players[0].score >= 7 || this.players[1].score >= 7) {
            this.server.emit('game', gameData);
            clearInterval(this.intervalID); // Arrêtez l'intervalle
        }
    }
}

intervalID = setInterval(() => {
        this.heartBeat();
}, 33);
  
//   The @SubscribeMessage decorator is used in NestJS WebSocket gateways to indicate 
//   that a particular method should be invoked when a specific WebSocket message is received.
  @SubscribeMessage('playerData')
  handleUserData(
    @MessageBody() data: any, //It instructs NestJS to inject the message body directly into the data parameter.
    @ConnectedSocket() client: any, //By using the @ConnectedSocket decorator, you can access the client's socket connection within a WebSocket gateway method, enabling you to perform client-specific actions or emit messages specifically to that client.
  ): string {

    //Add new socket connection to players list
    let paddleInstance: Paddle;
    if (this.players.length % 2 === 0) {
        paddleInstance = {
            socketId: data.socketId,
            Id: data.currentUser || 0,
            width: 25,
            height: 100,
            x: 0,
            y: 0,
            score: 0,
            color: "pink",
        };
    } else {
        paddleInstance = {
            socketId: data.socketId,
            Id: data.currentUser || 0,
            width: 25,
            height: 100,
            x: this.gameWidth - 25,
            y: this.gameHeight - 100,
            score: 0,
            color: "orange",
        };
    }
    this.players.push(paddleInstance);

    return data;
  }

  @SubscribeMessage('changeDirection')
  changeDirection(
    @MessageBody() data: any,
    @ConnectedSocket() client: any,
    ) {
    const paddleUp = "ArrowUp";
    const paddleDown = "ArrowDown";
    let i = 0;
    
    if(client.id === this.players[0].socketId) {
        i = 0;
    }
    else if (client.id === this.players[1].socketId) {
        i = 1;
    }
        switch (data) {
        case paddleUp:		
        if (this.players[i].y > 0) {
            this.players[i].y -= this.paddleSpeed;
        }
        break;
        case paddleDown:
        if (this.players[i].y < this.gameHeight - this.players[i].height) {
            this.players[i].y += this.paddleSpeed;
        }
        break;
        }
  };
  
   moveBall () {
    this.ball.X += this.ballSpeed * this.ballXDirection;
    this.ball.Y += this.ballSpeed * this.ballYDirection;
};

  checkCollision () {

    if (this.ball.Y <= 0 + this.ballRadius) {
        this.ballYDirection *= -1;
    }

    if (this.ball.Y >= this.gameHeight - this.ballRadius) {
        this.ballYDirection *= -1;
    }

    if (this.ball.X <= 0) {
        this.players[1].score += 1;
        this.ball.X = this.gameWidth / 2;
        this.ball.Y = this.gameHeight / 2;
        this.ballXDirection = Math.random() < 0.5 ? -1 : 1;
        this.ballYDirection = Math.random() < 0.5 ? -1 : 1;
        this.ballSpeed += 0.5;
        return;
    }

    if (this.ball.X >= this.gameWidth) {
        this.players[0].score += 1;
        this.ball.X = this.gameWidth / 2;
        this.ball.Y = this.gameHeight / 2;
        this.ballXDirection = Math.random() < 0.5 ? -1 : 1;
        this.ballYDirection = Math.random() < 0.5 ? -1 : 1;
        this.ballSpeed += 0.5;
        return;
    }

    if (this.ball.X <= this.players[0].x + this.players[0].width + this.ballRadius) {
        if (this.ball.Y > this.players[0].y && this.ball.Y < this.players[0].y + this.players[0].height) {
        this.ball.X = this.players[0].x + this.players[0].width + this.ballRadius; //if ball gets stuck
        this.ballXDirection *= -1;
        this.ballSpeed += 0.5;
        this.ball.color = "pink";
        }
    }

    if (this.ball.X >= this.players[1].x - this.ballRadius) {
		if (this.ball.Y > this.players[1].y && this.ball.Y < this.players[1].y + this.players[1].height) {
		this.ball.X = this.players[1].x - this.ballRadius; //if ball gets stuck
		this.ballXDirection *= -1;
		this.ballSpeed += 0.5;
    this.ball.color = "orange";
		}
	}
}
}