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
		try {
			let participantsArray = participants.map((id: number) => {return {id : id}});

			//création du chat dans la DB : ajout dans la table et connexion
			// avec les participants (table User)
			const chat = await this.prisma.chat.create({
				data: {
					creatorId,
					participants: {
						connect: participantsArray, // connect: [{ id: 8 }, { id: 9 }, { id: 10 }],
					},
					participantsCount: participantsArray.length
				},
				include: {
					participants: true, // Include all participants in the returned object
					messages : true
				},
			})
			return chat;
		} catch (error) {
            console.log(error);
            throw error;
		}
	}

	async findChatByParticipants(participantIds) {
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
				messages : true
			},
		})
		return chat;
	}

	async findChatById(chatId:number) {
		const chat = await this.prisma.chat.findFirst({
			where: {
				id : chatId
			},
			include: {
				participants: true, // Include all participants in the returned object
				messages : true,
				channelInfo : {
					include : {
						administrators: true,
						bannedUsers: true,
						mutedUsers: {include: {user: true}},
					}
				}
			},
		})
		return chat;
	}

	//if the chat exists, return it. If it does not, create it
	async findOrCreateChat(participantIds, creatorId) {
		try {
			const findChat = await this.findChatByParticipants(participantIds);
			if (!findChat) {
				const newChat = await this.createChat(participantIds, creatorId);
				return newChat;
			}
			return findChat;
		} catch (error) {
            console.log(error);
            throw error;
		}
	}

	async findAllMyChats(me) {
		//find all the chats where I am
		const myChats = await this.prisma.chat.findMany({
			where: {
				participants : {
					some : {id : {in: [me.sub]}}
				},
			},
			include: {
				participants: true, // Include all participants in the returned object
				messages : true, // Include all messages in the returned object
				channelInfo : {
					include : {
						administrators: true,
						bannedUsers: true,
						mutedUsers: {include: {user: true}},
					}
				}
			},
		})
		return myChats;
	}
}
