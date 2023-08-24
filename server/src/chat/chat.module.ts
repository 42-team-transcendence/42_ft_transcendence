import { Module } from "@nestjs/common";
import ChatGateway from "./chat.gateway";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";
import { ChannelController } from "./channel.controller";
import { ChannelService } from "./channel.service";

@Module({
    // imports: [JwtModule.register({})],
    providers: [ChatGateway, ChatService, ChannelService],
    controllers: [ChatController, ChannelController],
})

export class ChatModule{}
