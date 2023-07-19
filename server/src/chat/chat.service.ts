import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
// import { CreateChatParams, } from "./chat";
import { User } from "@prisma/client";

@Injectable()
export class ChatService {
// export class ChatService implements IChatService {
		constructor(
        private prisma: PrismaService,
    ) {}

	// async createChat(params: CreateChatParams, creator:User) {
	async createChat(participants, creatorId) {
		let participantsArray = participants.map((id: number) => {return {id : id}});
		
		//création du chat dans la DB : ajout dans la table et connexion
		// avec les participants (table User)
		const chat = await this.prisma.chat.create({
			data: {
				creatorId,
				participants: {
					connect: participantsArray, // connect: [{ id: 8 }, { id: 9 }, { id: 10 }],
				},
				participantsCount: participantsArray.length()
			},
			include: {
				participants: true, // Include all participants in the returned object
			},
		})
		console.log(chat);
		return chat;
	}

	async findChatByParticipants(participantIds) {
		console.log({participantIds})
		//find chats that include exactly the specified participants 
		const chat = await this.prisma.chat.findFirst({
			where: {
				AND : [
					{participants : {every : {id : {in: participantIds}}}},
					{participantsCount : participantIds.length}
				]
			},
			include: {
				participants: true, // Include all participants in the returned object
			},
		})
		console.log({chat});
		return chat;
	}
}

// AND : [{
// 	participants : {
// 	none: {id : {notIn: participantIds}}
// }},
// { 
// 	participantsCount : participantIds.length()
// }]