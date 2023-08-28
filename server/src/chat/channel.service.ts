import { Injectable } from "@nestjs/common";
import { disconnect } from "process";
import { PrismaService } from "src/prisma/prisma.service";
// import { CreateChatParams, } from "./chat";

@Injectable()
export class ChannelService {
// export class ChatService implements IChatService {
		constructor(
        private prisma: PrismaService,
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
							mutedUsers: true,
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
					mutedUsers: {
						...(payload.newMuted ? {connect: {id: payload.newMuted}}: {}),
						...(payload.oldMuted? {disconnect: {id: payload.oldMuted}}: {})
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
					mutedUsers: true,
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
