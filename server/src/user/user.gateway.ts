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
import { PrismaClient } from '@prisma/client';

interface Online {
	userId: string;
	isOnline: boolean;
  }


const prisma = new PrismaClient();

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
				console.log("handleConnection: ", {existingUserData}, client.id);
				this.updateIsOnline(true, parseInt(existingUserData.userId));
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
			console.log("handleDisconnect: ", {existingUserData}, client.id);
			this.updateIsOnline(true, parseInt(existingUserData.userId));
		}
		this.updateOnlineUsers();
	}


/**********************************************************************************************************************************************/
/**********************************************************************************************************************************************/

	async updateIsOnline(online: boolean, userId: number) {
		if (userId) {
			try {
				await prisma.user.update({
					where: { id: userId },
					data: { isOnline: online },
				});
			} catch (error) {
				console.log(error);
				throw error;
			}
		}
	}

	@SubscribeMessage('userLoggedIn')
  	handleUserLoggedIn(client: Socket, data: { userId: string }) {

			this.onlineUsers.set(client.id, {userId: data.userId, isOnline: true});
			console.log("userLoggedIn: ", {data}, client.id);
			this.updateIsOnline(true, parseInt(data.userId));
			this.updateOnlineUsers();
	}

	@SubscribeMessage('userLogout')
	handleUserLogout(client: Socket, data: {userId: string}) {
		for (const [socketIdInMap, online] of this.onlineUsers.entries()) {
			if (online.userId == data.userId) {
				this.onlineUsers.delete(socketIdInMap);
				break;
			}
		}
		console.log("userLogout: ", {data}, client.id);
		this.updateIsOnline(false, parseInt(data.userId));
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
