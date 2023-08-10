import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from '@prisma/client';
import * as argon from 'argon2';
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserService {
	constructor(
        private prisma: PrismaService,
    ) {}
	// =============================================================================
	// GETTERS =====================================================================
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
	

	// =============================================================================
	// UPDATES =====================================================================
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

	async updateNick(nickname: string, userId: number) {
	  try {
		await this.prisma.user.update({
		  where: { id: userId },
		  data: { nickname: nickname },
		});
	  } catch (error) {
		if (
		  error instanceof Prisma.PrismaClientKnownRequestError &&
		  error.code === 'P2002' &&
		  Array.isArray((error.meta as any)?.target) &&
		  (error.meta as any)?.target.includes('nickname')
		) {
		  throw new Error('Nickname is already taken. Please choose a different nickname.');
		}
		// Handle other errors or re-throw if needed.
		throw error;
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
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === 'P2002' &&
				Array.isArray((error.meta as any)?.target) &&
				(error.meta as any)?.target.includes('email')
			  ) {
				throw new Error('Email is already taken. Please choose a different email.');
			  }
			  // Handle other errors or re-throw if needed.
			  throw error;
		}
	}
	  
	  



	async updateUser(userId: number, updateData: { score?: number, email?: string }) {
		try {
			await this.prisma.user.update({
				where: { id: userId },
				data: updateData,
			});
	
			if (updateData.score !== undefined) {
				console.log(`Score updated successfully for user with ID: ${userId}`);
			}
			if (updateData.email !== undefined) {
				console.log (`USER data emil = ${updateData.email}`);
				console.log(`Email updated successfully for user with ID: ${userId}`);
			}
		} catch (error) {
			console.error('Error updating user:', error);
		}
	}

}