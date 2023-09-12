//@nestjs/websockets : base package that makes websocket integration possible in NestJS
import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayDisconnect,
    OnGatewayConnection,
  } from '@nestjs/websockets';
//@nestjs/platform-socket.io is the specific package for socket.io integration
import { Server, Socket } from 'socket.io';

interface Online {
	userId: string;
	isOnline: boolean;
  }

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
	private onlineUsers: Map<string, Online> = new Map();


/**********************************************************************************************************************************************/
/**********************************************************************************************************************************************/
	afterInit(server: Server) {
		console.log('!!!!!!!! -User websocket initialized- !!!!!!!');
	}
  
	handleConnection(client: Socket) {

		for (const [socketIdInMap, online] of this.onlineUsers.entries()) {
			if (socketIdInMap === online.userId) {
				const existingUserData = this.onlineUsers.get(socketIdInMap);
				existingUserData.isOnline = true;
				existingUserData.userId = socketIdInMap;
				this.onlineUsers.delete(socketIdInMap);
				this.onlineUsers.set(client.id, existingUserData);
				break;
			}
		}
		this.updateOnlineUsers();
	}

	handleDisconnect(client: Socket) {

		const existingUserData = this.onlineUsers.get(client.id);
		this.onlineUsers.delete(client.id);
		if (existingUserData && existingUserData.isOnline === true) {
			existingUserData.isOnline = false;
			this.onlineUsers.set(existingUserData.userId, existingUserData);
		}
		this.updateOnlineUsers();
	}


/**********************************************************************************************************************************************/
/**********************************************************************************************************************************************/

	@SubscribeMessage('userLoggedIn')
  	handleUserLoggedIn(client: Socket, data: { userId: string }) {
		// const existingUserData = this.onlineUsers.get(client.id);

		// if (existingUserData) {
		// 	existingUserData.userId = data.userId;
		// 	existingUserData.isOnline = true;
			this.onlineUsers.set(client.id, {userId: data.userId, isOnline: true});
			this.updateOnlineUsers();
		// }
	}

	@SubscribeMessage('userLogout')
	handleUserLogout(client: Socket, data: {userId: string}) {
		for (const [socketIdInMap, online] of this.onlineUsers.entries()) {
			if (online.userId == data.userId) {
				this.onlineUsers.delete(socketIdInMap);
				break;
			}
		}
		this.onlineUsers.delete(client.id);
		this.updateOnlineUsers();
	}

	private updateOnlineUsers() {
		const onlineUsersArray = Array.from(this.onlineUsers.entries());
		console.log({onlineUsersArray});
		this.server.emit('onlineUsers', onlineUsersArray);
		console.log('Utilisateurs en ligne mis à jour :', onlineUsersArray);
	}

}
