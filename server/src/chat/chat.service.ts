import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateChatParams, IChatService } from "./chat";

@Injectable()
export class ChatService implements IChatService {
	constructor(
        private prisma: PrismaService,
    ) {}

	async createChat(params: CreateChatParams) {
		// const users = await this.prisma.user.findMany();
		// return (users);
	}

}