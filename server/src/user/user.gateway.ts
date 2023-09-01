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
	  path: "/status",
	},
  )
  export default class UserGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() 
  	server: Server;

	private onlineUsers: Set<string> = new Set();

	afterInit(server: Server) {
		console.log('!!!!!!!! -User websocket initialized- !!!!!!!');
	}
  
	handleConnection(client: Socket) {
		const userId = client.id;
		this.updateOnlineUsers();
		// console.log(`User ${userId} connected.`);

		let pingInterval: NodeJS.Timeout;
			client.on('ping', () => {
			client.emit('pong');
		});
		// Envoyez un ping au client toutes les 5 secondes
			pingInterval = setInterval(() => {
			client.emit('ping');
		}, 5000);

		client.on('disconnect', () => {
		clearInterval(pingInterval);
		this.onlineUsers.delete(userId);
		this.updateOnlineUsers();
		console.log(`Client déconnecté : ${userId}`);
    	});
	}

	handleDisconnect(client: Socket) {
		// const userId = client.id;
		// this.onlineUsers.delete(userId);
		// this.updateOnlineUsers();
		console.log(`User ${client.id} disconnected.`);
	}

	@SubscribeMessage('userLoggedIn')
  	handleUserLoggedIn(client: Socket, data: { userId: string }) {
		const userId = data.userId;
		//console.log(userId);
		this.onlineUsers.add(userId);
		this.updateOnlineUsers();
		console.log(`User ${userId} logged in.`);
	}

	private updateOnlineUsers() {
		const onlineUsersArray = Array.from(this.onlineUsers);
		this.server.emit('onlineUsers', onlineUsersArray);
		console.log('Utilisateurs en ligne mis à jour :', onlineUsersArray);
	}
}
