import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from '@prisma/client';
import * as argon from 'argon2';
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as multer from 'multer';
import { disconnect } from "process";

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
		  include: {blocked:true}
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
		console.log('---------GET SCORE---------');
		return user?.score ?? 0;
	}

	async getAuth2fa(email: string) {
		const user = await this.prisma.user.findUnique({
		  where: { email: email },
		  select: { auth2fa: true },
		});
		return user?.auth2fa;
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


	async update2fa(auth2fa: boolean,  userId: number) {
		try {
			if (auth2fa === false)
			{
				await this.prisma.user.update({
					where: {id: userId},
					data: { secret: null }
				})
			}
			await this.prisma.user.update({
				where: {id: userId},
				data: { auth2fa: auth2fa }
			});
			console.log(`2FA updated successfully for user with ID: ${userId}`);
		} catch (error) {
		  	console.error('Error updating 2FA:', error);
		}
	}


	// async uploadAvatar(avatar: Express.Multer.File, userId: number) {
	// 	try {
	// 	  const data: Prisma.UserUpdateInput = {
	// 		avatar: avatar.filename, // Use avatar.filename
	// 	  };
	  
	// 	  await this.prisma.user.update({
	// 		where: { id: userId },
	// 		data: data,
	// 	  });
	  
	// 	  console.log(`Avatar updated successfully for user with ID: ${userId}`);
	// 	} catch (error) {
	// 	  console.error('Error updating Avatar:', error);
	// 	}
	// }
	  
	async uploadAvatar(file: any,  userId: number) {
		try {
			await this.prisma.user.update({
				where: {id: userId},
				data: { avatar: file.path }
			});
			console.log("avatar url = ", file.path);
			console.log(`Avatar updated successfully for user with ID: ${userId}`);
			
		} catch (error) {
		  	console.error('Error updating Avatar:', error);
		}
	}

	async findPP (username: string) {
		const user = await this.prisma.user.findUnique({
			where: { nickname: username},
			select: { avatar: true}
        });
        return user?.avatar;
    }

	// =============================================================================
	// UPDATES USER BLOCKED =====================================================================
	async updateBlockedUsers(userId: number, currentUserId: number, block: boolean) {
		try {
			const updateBlockedUsers = await this.prisma.user.update({
				where: { id: currentUserId },
				data: {
					blocked: {
						connect: (block ? {id: userId}: undefined),
						disconnect: (!block ? {id: userId}: undefined)
					}
				},
		  	});
			console.log({updateBlockedUsers});
			return updateBlockedUsers;
		} catch (error) {
		  	console.error(error);
			  throw new Error(error);
		}
	}
}

