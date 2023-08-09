import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as argon from 'argon2';
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserService {
	constructor(
        private prisma: PrismaService,
    ) {}

	async getUsers() {
		const users = await this.prisma.user.findMany();
		return (users);
	}

	async getMe(userId: number) {
		const user = await this.prisma.user.findUnique({
		  where: { id: userId },
		});
		console.log('---------ME---------');
		if (!user) {
            throw new Error('User not found');
        }
        return user;
	}

	async getUser(userId:number) {
		const user = await this.prisma.user.findFirst({where: {id: userId}});
		return (user);
	}

	async getScore(userId: number) {
		const user = await this.prisma.user.findUnique({
		  where: { id: userId },
		  select: { score: true },
		});
		console.log('---------ICI---------');
		return user?.score ?? 0;
	}
	
	async updateScore(score: number, userId: number) {
		try {
			await this.prisma.user.update({
				where: { id: userId },
				data: { score : score },
		  });
	
		console.log(`Score updated successfully for user with ID: ${userId}`);
		} catch (error) {
		  	console.error('Error updating score:', error);
		}
	}

	async updateEmail(email: string, userId: number) {
		try {
			await this.prisma.user.update({
				where: { id: userId },
				data: { email : email },
		  });
	
			console.log(`Email updated successfully for user with ID: ${userId}`);
		} catch (error) {
		  	console.error('Error updating email:', error);
		}
	}

	async updatePwd(pwd: string, userId: number) {
		try {
			const hash = await argon.hash(pwd);
			await this.prisma.user.update({
				where: { id: userId },
				data: { hash : hash },
		  });
	
			console.log(`Pwd updated successfully for user with ID: ${userId}`);
		} catch (error) {
		  	console.error('Error updating pwd:', error);
		}
	}

	async getNick(userId: number) {
		const user = await this.prisma.user.findUnique({
		  where: { id: userId },
		  select: { nickname: true },
		});
		console.log('---------Nick---------');
		return user?.nickname;
	}

	async updateNick(nickname: string, userId: number) {
		try {
			await this.prisma.user.update({
				where: { id: userId },
				data: { nickname : nickname },
		  });
	
			console.log(`Nick updated successfully for user with ID: ${userId}`);
		} catch (error) {
		  	console.error('Error updating Nick:', error);
		}
	}

}