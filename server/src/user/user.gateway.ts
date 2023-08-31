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
	  path: "/user", //replace http://localhost:3333/socket.io/ with http://localhost:3333/game/
	},
  )
  export default class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() 
  	server: Server;

	private onlineUsers = [];

	afterInit(server: Server) {
	// Perform initialization tasks here
	console.log('User websocket initialized');
	}
  
	//lifecycle method : automatically called by NestJS when a new client establishes a WebSocket connection with the server, due to OnGatewayConnection Interface
	handleConnection(client: Socket, ) {
		console.log(`Client connected: ${client.id}`)
	}
  
	//lifecycle method : automaticaly called on socket disconnection
	handleDisconnect(client: Socket) {
	  	console.log(`Client disconnected: ${client.id}`)
	}
  }