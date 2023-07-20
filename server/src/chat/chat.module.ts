import { Module } from "@nestjs/common";
import ChatGateway from "./chat.gateway";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";

@Module({
    // imports: [JwtModule.register({})],
    providers: [ChatGateway, ChatService],
    controllers: [ChatController],
})

export class ChatModule{}