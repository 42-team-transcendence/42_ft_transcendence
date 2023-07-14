//@nestjs/websockets : base package that makes websocket integration possible in NestJS
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    ConnectedSocket,
    WsResponse,
  } from '@nestjs/websockets';
//@nestjs/platform-socket.io is the specific package for socket.io integration
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, Socket, ServerOptions } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';

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
export default class ChatGateway implements OnGatewayInit {
    
    // Déclare une instance du Server de socket.io
    //this allows you to access the WebSocket server instance and utilize its methods,
    //including the emit() method.
    @WebSocketServer() 
    server: Server;

    //this method will be executed once the gateway is initialized.
    //This provides an opportunity to perform any necessary 
    //setup or initialization tasks before the WebSocket server starts accepting connections.
    afterInit(server: Server) {
        // Perform initialization tasks here
        console.log('WebSocket gateway initialized!');
      }

    //The @SubscribeMessage decorator is used in NestJS WebSocket gateways to indicate 
    //that a particular method should be invoked when a specific WebSocket message is received.
    @SubscribeMessage('message')
    handleChatMessage(
            @MessageBody() data: string, //It instructs NestJS to inject the message body directly into the data parameter.
            @ConnectedSocket() client: any, //By using the @ConnectedSocket decorator, you can access the client's socket connection within a WebSocket gateway method, enabling you to perform client-specific actions or emit messages specifically to that client.
        ): string {
        console.log('Received chat message:', data);

        // Access client-specific information
        const clientIpAddress = client.handshake.address;
        console.log({client_id : client.id});
        console.log({clientIpAddress});
        
        this.emitTest('message', data);
        
        return data;
    }

    emitTest(event:string, message:string): void {
        // Emit a message to all connected clients
        this.server.emit(event, { message: `Hello, clients! message received : ${message}` });
      }

}