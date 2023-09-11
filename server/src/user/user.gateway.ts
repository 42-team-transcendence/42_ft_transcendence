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

	// private onlineUsers: Set<string> = new Set();
	private onlineUsers: Map<string, string> = new Map();

	afterInit(server: Server) {
		console.log('!!!!!!!! -User websocket initialized- !!!!!!!');
	}
  
	handleConnection(client: Socket) {
		const socketId = client.id;
		// for (const [socketIdInMap, userId] of this.onlineUsers.entries()) {
		// 	if (socketIdInMap === socketId) {
		// 		this.onlineUsers.set(socketIdInMap, "user id qui n'existe pas pour le moment");
		// 		break;
		// 	}
		// }
		this.updateOnlineUsers();
	}

	handleDisconnect(client: Socket) {
		//const socketId = client.id;
		// for (const [socketIdInMap, userId] of this.onlineUsers.entries()) {
		// 	if (socketIdInMap === socketId) {
		// 		this.onlineUsers.delete(socketIdInMap);
		// 		break;
		// 	}
		// }
		// this.updateOnlineUsers();
		// console.log(`User ${client.id} disconnected.`);
	}

	@SubscribeMessage('userLoggedIn')
  	handleUserLoggedIn(client: Socket, data: { userId: string }) {
		const userId = data.userId;
		// //console.log(userId);
		// this.onlineUsers.add(userId);
		// this.updateOnlineUsers();
		// console.log(`User ${userId} logged in.`);
		this.onlineUsers.set(client.id, userId);
		this.updateOnlineUsers();
		console.log(`User ${client.id} logged in.`);
	}

	@SubscribeMessage('userLogout')
	handleUserLogout(client: Socket, data: {userId: string}) {
		// const userId = data.userId;
		// console.log(`the user wich logged out is ${userId}`);
		// this.onlineUsers.delete(userId);
		// this.updateOnlineUsers();
		// console.log(`User ${userId} logged out.`);
		const userId = data.userId;
		console.log(`the user wich logged out is ${userId}`);
		for (const [socketIdInMap, UserId] of this.onlineUsers.entries()) {
			if (UserId == userId) {
				this.onlineUsers.delete(socketIdInMap);
				break;
			}
		}
		this.onlineUsers.delete(userId);
		this.updateOnlineUsers();
		console.log(`User ${userId} logged out.`);
	}

	private updateOnlineUsers() {
		const onlineUsersArray = Array.from(this.onlineUsers.entries());
		console.log({onlineUsersArray});
		this.server.emit('onlineUsers', onlineUsersArray);
		console.log('Utilisateurs en ligne mis à jour :', onlineUsersArray);
	}
}
