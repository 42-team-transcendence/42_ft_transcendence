import { Controller, ForbiddenException, Get, Post, Param, UseGuards, Body, Res, Request, Req } from "@nestjs/common";
import { User } from '@prisma/client'; //User Typescript type generated by Prisma
import { JwtGuard } from "../auth/guard";
import { GetUser } from "../auth/decorator"
import { ChatService } from "./chat.service";
import { CreateChatDto } from "./dto";

@UseGuards(JwtGuard) //link this custom guard (check for jwt token for every user route of this controller) to our strategy named 'jwt' in file jwt.strategy.ts. 
@Controller('chats') // définit la route "/users" de l'API
export class ChatController {
	constructor (
		private chatService: ChatService
	) {}

	@Post('create')
	createChat(
		@GetUser() creator,
        @Body() payload,
    ) {
		console.log({payload});
		console.log({creator});
		const participants = [...payload.recipients, creator.sub];
		return (this.chatService.createChat(participants, creator.sub));
	}

	@Post('findByParticipants')
	findChatByParticipants(
		@GetUser() creator,
        @Body() payload,
    ) {
		console.log({payload});
		console.log({creator});
		const participantIds = [...payload.recipients, creator.sub];
		return (this.chatService.findChatByParticipants(participantIds));
	}

	@Post('findOrCreate')
	findOrCreateChat(
		@GetUser() creator,
        @Body() payload,
    ) {
		try {

			console.log({payload});
			console.log({creator});
			const participantIds = [...payload.recipients, creator.sub];
			const participantIdsNoDuplicates = [...new Set(participantIds)]
			if (participantIdsNoDuplicates.length < 2)
			throw new ForbiddenException('Cannot findOrCreate Chat with 1 user',);
			return (this.chatService.findOrCreateChat(participantIdsNoDuplicates, creator.sub));
		} catch (error) {
			throw error;
		}
	}

	@Get('findAllMyChats')
	findAllMyChats(
		@GetUser() me,
    ) {
		console.log("enter controller chat/findAllMyChats");
		console.log({me});
		return (this.chatService.findAllMyChats(me));
	}

}