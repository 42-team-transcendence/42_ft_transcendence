import { Injectable } from "@nestjs/common";
import { disconnect } from "process";
import { PrismaService } from "src/prisma/prisma.service";
import { MessageDto } from "./dto/gateway.dto";
import { ChatService } from "./chat.service";
// import { CreateChatParams, } from "./chat";

@Injectable()
export class ChannelService {
// export class ChatService implements IChatService {
		constructor(
        private prisma: PrismaService,
		private chatService: ChatService
    ) {}

	async createChannel(payload, creatorId) {
		try {
			//création du channel dans la DB : ajout dans la table chat et connexion avec la table channelInfos
			const channel = await this.prisma.chat.create({
				data: {
					creatorId,
					participants: {
						connect: [{id: creatorId}], // connect: [{ id: 8 }, { id: 9 }, { id: 10 }],
					},
					participantsCount: 1,
					channelInfo: {
						create: {
							name: payload.name,
							status: payload.status,
							password: payload.status? payload.password: undefined, // If undefined, does not include field in update!
							owner: {
								connect: {id: creatorId}
							},
							administrators: {
								connect: [{id: creatorId}]
							},
						}
					}
				},
			})
			console.log({channel});
			return channel;
		} catch (error) {
            console.log(error);
            throw error;
		}
	}

	async getChannelsByName(input:string) {
		try {
			const channels = await this.prisma.chat.findMany({
				where: {
					channelInfo: {
						name: {
							contains: input,
						}
					}
				},
				include: {
					participants: true, // Include all participants in the returned object
					channelInfo : {
						include : {
							administrators: true,
							bannedUsers: true,
							mutedUsers: {include: {user: true}},
						}
					}
				},
			})
			console.log({channels});
			return channels;
		} catch (error) {
            console.log(error);
            throw error;
		}
	}

	async joinChannel(channelId: number, userId:number) {
		try {
			const updatedChan = await this.prisma.chat.update({
				where: {id: channelId},
				data: {
					participants: {
						connect: {id: userId}, // connect: [{ id: 8 }, { id: 9 }, { id: 10 }],
					},
				},
				include: {
					participants: true, // Include all participants in the returned object
					channelInfo : true
				},
			})
			console.log({updatedChan});
			return updatedChan;
		} catch (error) {
            console.log(error);
            throw error;
		}
	}

	async checkIsValidSender(msg: MessageDto) {
		try {
			//Récupération des infos du chat
			const chat = await this.chatService.findChatById(msg.chatId);
			if (!chat) 
				return false; //chat non trouvé ==> erreur
			if (!chat.participants.find((e:any)=>e.id === msg.senderId))
				return false; //ne fait pas parti des participants ==> erreur
			if (!chat.channelInfo)
				return true; //Si c'est un chat, ok
			if (chat.channelInfo.bannedUsers.find((e:any)=>e.id === msg.senderId))
				return false //est ban ==> erreur
			if (chat.channelInfo.mutedUsers.find((e:any) => {
				return (
				  e.userId === msg.senderId && new Date(e.endsAt) > new Date())
			  }))
				return false //est mute ==> erreur
			return true;
		} catch (error) {
			console.log(error);
			throw error;
		}
  	}

  	async checkIsAdmin(chatId:number, userId: number) {
		try {
			//Récupération des infos du chat
			const chat = await this.chatService.findChatById(chatId);
			if (!chat) 
				return false; //chat non trouvé ==> erreur
			if (!chat.channelInfo.administrators.find((e:any)=>e.id === userId))
				return false; //ne fait pas parti des admins ==> erreur
			return true;
		} catch (error) {
			console.log(error);
			throw error;
		}
	}

	async deleteChannelMutedUser(channelInfoId: number, userId:number) {
		try {
			const updateMutedUsers = await this.prisma.channelMutedUsers.delete({
				where: { userId_channelId: { channelId: channelInfoId, userId: userId } },
				include: {
					channel: {
						include: {
							chat:{include: {participants : true}},
							administrators: true,
							bannedUsers: true
						}
					}
				}
			})
			console.log({updateMutedUsers});
			return updateMutedUsers;
		} catch (error) {
            console.log(error);
            throw error;
		}

	}

	async upsertChannelMutedUsers(chatId: number, userId:number, payload:any) {
		//payload create new connexion
		// Adding 45000 milliseconds to current datetime
		const futureDate = new Date(new Date().getTime() + 45000);
	
		try {
			const updateMutedUsers = await this.prisma.channelInfo.update({
				where: {chatId: chatId},
				data: { //undefined = do not include this in the update:
					mutedUsers: {
						upsert: payload.newMuted ? {
							where: {
								userId_channelId: {
									userId: payload.newMuted,
									channelId: payload.channelInfoId,
								}
							},
							update: { endsAt: futureDate },
							create: { endsAt: futureDate, user: {connect: {id: payload.newMuted}}}
						} : undefined,
					},
				},
				include: {
					chat : {include: {participants : true},},
					administrators : true,
					mutedUsers: {include: {user: true}},
					bannedUsers: true
				}
			})
			console.log({updateMutedUsers});
			return updateMutedUsers;
		} catch (error) {
            console.log(error);
            throw error;
		}

	}

	async updateChannelInfos(chatId: number, userId:number, payload:any) {
		try {
			const updatedChan = await this.prisma.channelInfo.update({
				where: {chatId: chatId},
				data: { //undefined = do not include this in the update:
					name: payload.name? payload.name : undefined, // If there is no payload.name, don't include in update!
					status: payload.status? payload.status : undefined,
					password: payload.password? payload.password : undefined,
					administrators: {//conditionnaly add or erase admin passed in payload
						...(payload.newAdmin ? {connect: {id: payload.newAdmin}}: {}), //ternary + spread operator
						...(payload.oldAdmin? {disconnect: {id: payload.oldAdmin}}: {})
					},
					bannedUsers: {
						...(payload.newBanned ? {connect: {id: payload.newBanned}}: {}),
						...(payload.oldBanned? {disconnect: {id: payload.oldBanned}}: {})
					},
					chat: {
						update: {
							participants: {
								...(payload.newParticipant ? {connect: {id: payload.newParticipant}}: {}),
								...(payload.oldParticipant? {disconnect: {id: payload.oldParticipant}}: {})
							}
						}
					}
				},
				include: {
					chat : {include: {participants : true},},
					administrators : true,
					mutedUsers: {include: {user: true}},
					bannedUsers: true
				}
			})
			console.log({updatedChan});
			return updatedChan;
		} catch (error) {
            console.log(error);
            throw error;
		}
	}
}
