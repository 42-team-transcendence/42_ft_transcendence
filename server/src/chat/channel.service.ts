import { Injectable } from "@nestjs/common";
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
					channelInfo : true
				},
			})
			console.log({channels});
			return channels;
		} catch (error) {
            console.log(error);
            throw error;
		}
	}
}
