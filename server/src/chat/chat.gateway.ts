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

//The WebSocket gateway is responsible for handling WebSocket connections and events in NestJS.
// the OnGatewayInit interface is a part of the WebSockets module.
// It is used to define a lifecycle hook that is triggered when a WebSocket gateway is initialized.
@WebSocketGateway(
  // 4444,
  {
    cors: {
      origin: ["http://localhost:3000", "http://localhost:3000/chat"],
      credentials: true
    },
    // path: "/chat"
  },
) //listen on indicated port, allow all frontend connexions
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
        console.log({client});

        this.emitTest('message');
        
        return data;
    }

    emitTest(event : string): void {
        // Emit a message to all connected clients
        this.server.emit(event, { message: 'Hello, clients! message received' });
      }

}