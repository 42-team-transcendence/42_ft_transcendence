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
    BaseWsExceptionFilter,
    WsException,
  } from '@nestjs/websockets';
//@nestjs/platform-socket.io is the specific package for socket.io integration
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, Socket, ServerOptions } from 'socket.io';
import { UseFilters, UseGuards, UsePipes, ValidationPipe, WsExceptionFilter } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { PrismaService } from "src/prisma/prisma.service";
import { GetUserDto } from 'src/auth/dto';
import { MessageDto } from './dto/gateway.dto';
import { WSValidationPipe } from './pipe/wsValidationPipe';
import { BadRequestExceptionsFilter } from './pipe/wsExceptionFilter';
import { ChannelService } from './channel.service';
import { ChatService } from './chat.service';

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
    namespace: "/ns-chat", //specific namespace for the chat
    path: "/chat", //replace http://localhost:3333/socket.io/ with http://localhost:3333/chat/
  },
)
@UseFilters(BadRequestExceptionsFilter) //TO DO: THIS IS NOT WORKING, no error sent to client
@UsePipes(new ValidationPipe())
export default class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private prisma: PrismaService,
    private channelService: ChannelService,
    private chatService: ChatService,
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
      console.log('!!!!!!!!!!!!!!!!!!!!!!!WebSocket gateway initialized!!!!!!!!!!!');
    }

  //lifecycle method : automatically called by NestJS when a new client establishes a WebSocket connection with the server, due to OnGatewayConnection Interface
  handleConnection(
    client: Socket,
  ) {
      // console.log("handleConnection")
      // console.log({client_handshake : client.handshake});
  }

  //lifecycle method : automaticaly called on socket disconnection
  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId; // Assuming you pass userId as a query parameter while connecting

    //Remove socket connection from connectedClients list
    this.connectedClients = this.connectedClients.filter((e:any) => e.userId != userId);
  }

  //The @SubscribeMessage decorator is used in NestJS WebSocket gateways to indicate
  //that a particular method should be invoked when a specific WebSocket message is received.
  @SubscribeMessage('userData')
  async handleUserData(
    @MessageBody() data: any, //It instructs NestJS to inject the message body directly into the data parameter.
    @ConnectedSocket() client: Socket, //By using the @ConnectedSocket decorator, you can access the client's socket connection within a WebSocket gateway method, enabling you to perform client-specific actions or emit messages specifically to that client.
  ) {

    //Get all chats of user and add user to corresponding socket rooms
    const userChats = await this.chatService.findAllMyChats(data.userId);
    client.join(userChats.map(chat => "room_" + chat.id));

    //Add new socket connection to connectedClients list
    if (this.connectedClients.find((e:any) => e.userId === data.userId))
      this.connectedClients = this.connectedClients.filter((e:any) => e.userId !== data.userId);
    this.connectedClients.push({userId : data.userId, socketId : data.socketId});
  }

  @SubscribeMessage('message')
  async handleChatMessage(
    @MessageBody() data: MessageDto, //It instructs NestJS to inject the message body directly into the data parameter.
    @ConnectedSocket() client: Socket, //By using the @ConnectedSocket decorator, you can access the client's socket connection within a WebSocket gateway method, enabling you to perform client-specific actions or emit messages specifically to that client.
  ) {
    try {
      //check that the sender is valid (not muted, not banned, is in participants)
      const isValidSender = await this.channelService.checkIsValidSender(data);
      if (!isValidSender)
        throw new WsException('User is not allowed to post here');

      //store message sent in DB
      const createdMsg = await this.chatService.storeMessage(data);

      //on s'assure que le client est bien dans la room correspondante au chatId
      client.join("room_" + createdMsg.chatId);
      //Envoyer le message à la room
      this.sendMessageToRoom(data.content, "room_" + createdMsg.chatId, data.senderId, createdMsg.createdAt);
    } catch (error) {
        console.log(error);
        throw error;
    }
  }

  // Emit a message to a room
  sendMessageToRoom(content:string, roomId:string, senderId:number, createdAt:Date): void {
    this.server.to(roomId).emit('message', { content, senderId, createdAt });
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
