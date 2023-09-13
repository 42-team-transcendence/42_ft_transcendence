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
import { Paddle, Ball, GameInfo } from './game.types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

let player1Id: number;
let player2Id: number;
let player1Score: number;
let player2Score: number;
let winnerId: number;

async function updateRank() {
  try {
    const users = await prisma.user.findMany();
    users.sort((a: any, b: any) => b.score - a.score);

    for (let index = 0; index < users.length; index++) {
      const user = users[index];
      await prisma.user.update({
        where: { id: user.id },
        data: { rank: index + 1 },
      });
    }
  } catch (error) {
    console.error('Error updating ranks:', error);
  }
}

async function updateScore(userId: number) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { score: { increment: 100 } },
    });
    updateRank();
  } catch (error) {
    console.error('Error updating user:', error);
  }
}

async function saveScoresToDatabase(player1Id: number, player2Id: number, player1Score: number, player2Score: number, winnerId: number) {
    try{
		const game = await prisma.game.create({
			data: {
				player_1_id: player1Id,
				player_2_id: player2Id,
				player_1_score: player1Score,
				player_2_score: player2Score,
				winnerId: winnerId,
			},
    	});
    console.log('Game saved:', game);
    if(winnerId != 0) {
        updateScore(winnerId); 
    }
	} 
	catch(error){
		console.log("Error saving game:", error);
	}
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

  private rooms: Map<string, GameInfo> = new Map();

  /*-------------------------------------------------------------------------------------------------------------------------------*/
  /*-------------------------------------------------------------------------------------------------------------------------------*/

  //lifecycle method : it will be executed automatically (due to OnGatewayInit interface) once the gateway is initialized.
  //This provides an opportunity to perform any necessary 
  //setup or initialization tasks before the WebSocket server starts accepting connections.
  afterInit(server: Server) {
      // Perform initialization tasks here
      console.log(' !!!!!!!!! Game WebSocket gateway initialized !!!!!!!!');
    }

  //lifecycle method : automatically called by NestJS when a new client establishes a WebSocket connection with the server, due to OnGatewayConnection Interface
  handleConnection(
    client: Socket,
  ) {
    const gameInfo: GameInfo = {
      players: [],
      gameWidth: 800, 
      gameHeight: 400,
      ballRadius: 12.5,
      paddleSpeed: 50,
      ballSpeed: 3,
      ball: {
        X: 0,
        Y: 0,
        color: "orange"
      },
      ballXDirection: Math.random() < 0.5 ? -1 : 1,
      ballYDirection: Math.random() < 0.5 ? -1 : 1,
      intervalID: undefined,
	  ifDBsaved: false,
    };
    gameInfo.ball.X = gameInfo.gameWidth / 2;
    gameInfo.ball.Y = gameInfo.gameHeight / 2;

	// Assign the client to an existing room or create a new room
  const roomName = this.assignPlayerToRoom(client, gameInfo);

	// Send the room name to the client
	client.emit('roomAssigned', roomName);

  }

  //lifecycle method : automaticaly called on socket disconnection
  handleDisconnect(client: Socket) {

    // Find the room that the client was in
    // let index = -1;

      for (const [roomName, gameInfo] of this.rooms) {
        const index = gameInfo.players.findIndex(player => player.socketId === client.id);
		if(gameInfo.players.length === 2 ){
			player1Id = gameInfo.players[0].Id;
			player2Id = gameInfo.players[1].Id;
			player1Score = gameInfo.players[0].score;
			player2Score = gameInfo.players[1].score;
			if(player1Score > player2Score)
			winnerId = player1Id;
			else if(player1Score < player2Score)
				winnerId = player2Id;
			else if(player1Score == player2Score || (player1Score == 0 && player2Score == 0))
				winnerId = 0;
			//console.log(`ifDBsaved = ${gameInfo.ifDBsaved}`);
			if(gameInfo.ifDBsaved == false)
			{
				saveScoresToDatabase(player1Id, player2Id, player1Score, player2Score, winnerId);
				gameInfo.ifDBsaved = true;
			}
		}
        if (index !== -1) {
          gameInfo.players.splice(index, 1);
          console.log("!!! DISCONNECTED !!! == " + gameInfo.players.length);
  
      // Emit a 'playerDisconnected' event to the remaining client in the room
          if (gameInfo.players.length === 1) {
            this.server.to(roomName).emit('playerDisconnected', 'The other player has disconnected');
            this.rooms.delete(roomName);
			// this.server.to(roomName).emit('gameOver');
          }else if(gameInfo.players.length === 0) {
            this.rooms.delete(roomName);
        }
          break;
        }
      }
    }

  /*-------------------------------------------------------------------------------------------------------------------------------*/
  /*-------------------------------------------------------------------------------------------------------------------------------*/

assignPlayerToRoom(client: Socket, gameInfo: GameInfo): string {
    for (const [roomName, objet] of this.rooms) {
      if (objet.players.length < 2) {
          client.join(roomName);
          return roomName;
      }
  }

  // If no available room, create a new one
  const newRoomName = `gameRoom${this.rooms.size + 1}`;
  this.rooms.set(newRoomName, gameInfo);
  client.join(newRoomName);

  return newRoomName;
}

heartBeat(roomName: string, gameInfo: GameInfo, client: Socket) {

    let info = this.rooms.get(roomName);

	if (info) {
    if(info.players.length > 1) {
      const gameData = {
          ball: gameInfo.ball,
          players: gameInfo.players,
      };

      this.server.to(roomName).emit('game', gameData);
      this.moveBall(gameInfo);
      this.checkCollision(gameInfo);

      if (gameInfo.players[0].score >= 3 || gameInfo.players[1].score >= 3) {
		player1Id = info.players[0].Id;
		player2Id = info.players[1].Id;
		player1Score = gameInfo.players[0].score;
		console.log(`player1 id ${player1Id}`);
		player2Score = gameInfo.players[1].score;
		console.log(`player2 id ${player2Id}`);
		if(player1Score > player2Score)
			winnerId = player1Id;
		else if(player1Score < player2Score)
			winnerId = player2Id;
		else if(player1Score == player2Score )
			winnerId = 0;
		saveScoresToDatabase(player1Id, player2Id, player1Score, player2Score, winnerId);
		gameInfo.ifDBsaved = true;
        this.server.to(roomName).emit('game', gameData);
        clearInterval(gameInfo.intervalID); // Arrêtez l'intervalle
		// this.disconnect(client);
      }
    }
    else {
      clearInterval(gameInfo.intervalID); // Arrêtez l'intervalle
	//   gameInfo.players.length = 0;
	//   this.rooms.delete(roomName);
	  this.server.to(roomName).emit('gameOver');
    }
}
}

interval(roomName: string, gameInfo: GameInfo, client: Socket) {

  gameInfo.intervalID = setInterval(() => {
		this.heartBeat(roomName, gameInfo, client);
	}, 33);
}
  
//   The @SubscribeMessage decorator is used in NestJS WebSocket gateways to indicate 
//   that a particular method should be invoked when a specific WebSocket message is received.
  @SubscribeMessage('playerData')
  handleUserData(
    @MessageBody() data: any, //It instructs NestJS to inject the message body directly into the data parameter.
    @ConnectedSocket() client: any, //By using the @ConnectedSocket decorator, you can access the client's socket connection within a WebSocket gateway method, enabling you to perform client-specific actions or emit messages specifically to that client.
  ): string {

    let info = this.rooms.get(data.roomName);
    //Add new socket connection to players list
    let paddleInstance: Paddle;
    if (info.players.length % 2 === 0) {
        paddleInstance = {
            socketId: data.socketId,
            Id: data.currentUser || 0,
            nickname: data.nickname,
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
            nickname: data.nickname,
            width: 25,
            height: 100,
            x: info.gameWidth - 25,
            y: info.gameHeight - 100,
            score: 0,
            color: "orange",
        };
    }

    info.players.push(paddleInstance);
    const roomClients = info.players;

    // Check and start the game if there are 2 players in the room
    if (roomClients && roomClients.length === 1) {
    } else if (roomClients && roomClients.length === 2) {
        this.interval(data.roomName, info, client);
    }

    return data;
  }

  @SubscribeMessage('changeDirection')
  changeDirection(
    @MessageBody() data: any,
    @ConnectedSocket() client: any,
    ) {

    let info = this.rooms.get(data.roomName);
    const paddleUp = "ArrowUp";
    const paddleDown = "ArrowDown";
    let i = 0;
    
    if(client.id === info.players[0].socketId) {
        i = 0;
    }
    else if (client.id === info.players[1].socketId) {
        i = 1;
    }
        switch (data.keyPressed) {
        case paddleUp:		
        if (info.players[i].y > 0) {
          info.players[i].y -= info.paddleSpeed;
        }
        break;
        case paddleDown:
        if (info.players[i].y < info.gameHeight - info.players[i].height) {
          info.players[i].y += info.paddleSpeed;
        }
        break;
        }
  };
  
   moveBall (gameInfo: GameInfo) {
    gameInfo.ball.X += gameInfo.ballSpeed * gameInfo.ballXDirection;
    gameInfo.ball.Y += gameInfo.ballSpeed * gameInfo.ballYDirection;
};

  checkCollision (gameInfo: GameInfo) {

    if (gameInfo.ball.Y <= 0 + gameInfo.ballRadius) {
      gameInfo.ballYDirection *= -1;
    }

    if (gameInfo.ball.Y >= gameInfo.gameHeight - gameInfo.ballRadius) {
      gameInfo.ballYDirection *= -1;
    }

    if (gameInfo.ball.X <= 0) {
        gameInfo.players[1].score += 1;
        gameInfo.ball.X = gameInfo.gameWidth / 2;
        gameInfo.ball.Y = gameInfo.gameHeight / 2;
        gameInfo.ballXDirection = Math.random() < 0.5 ? -1 : 1;
        gameInfo.ballYDirection = Math.random() < 0.5 ? -1 : 1;
        return;
    }

    if (gameInfo.ball.X >= gameInfo.gameWidth) {
      gameInfo.players[0].score += 1;
      gameInfo.ball.X = gameInfo.gameWidth / 2;
      gameInfo.ball.Y = gameInfo.gameHeight / 2;
      gameInfo.ballXDirection = Math.random() < 0.5 ? -1 : 1;
      gameInfo.ballYDirection = Math.random() < 0.5 ? -1 : 1;
        return;
    }

    if (gameInfo.ball.X <= gameInfo.players[0].x + gameInfo.players[0].width + gameInfo.ballRadius) {
        if (gameInfo.ball.Y > gameInfo.players[0].y && gameInfo.ball.Y < gameInfo.players[0].y + gameInfo.players[0].height) {
          gameInfo.ball.X = gameInfo.players[0].x + gameInfo.players[0].width + gameInfo.ballRadius; //if ball gets stuck
          gameInfo.ballXDirection *= -1;
          gameInfo.ballSpeed += 0.5;
          gameInfo.ball.color = "pink";
        }
    }

    if (gameInfo.ball.X >= gameInfo.players[1].x - gameInfo.ballRadius) {
		if (gameInfo.ball.Y > gameInfo.players[1].y && gameInfo.ball.Y < gameInfo.players[1].y + gameInfo.players[1].height) {
      gameInfo.ball.X = gameInfo.players[1].x - gameInfo.ballRadius; //if ball gets stuck
      gameInfo.ballXDirection *= -1;
      gameInfo.ballSpeed += 0.5;
      gameInfo.ball.color = "orange";
		}
	}
}
}