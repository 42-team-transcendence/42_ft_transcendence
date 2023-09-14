import { ForbiddenException, Injectable, UnauthorizedException  } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from '@prisma/client';
import * as argon from 'argon2';
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as multer from 'multer';
import { disconnect, nextTick } from "process";

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

	async getUsersNumber() {
		const users = await this.prisma.user.findMany();
		return (users.length);
	}

	async getMe(userId: number) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
				include: {
					blocked:true,
					blockedBy:true,
					friend: true,
					friendOf: true,
			}
		});
		if (!user) {
			throw new UnauthorizedException('User not found');
        }
        return user;
	}

	async getUser(userId:number) {
		const user = await this.prisma.user.findFirst({
			where: {id: userId},
			include: {
				blocked:true,
				blockedBy:true,
				friend: true,
				friendOf: true,
			}
		});
		return (user);
	}

	async getScore(userId: number) {
		const user = await this.prisma.user.findUnique({
		  where: { id: userId },
		  select: { score: true },
		});
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
	async updatePwd(pwd: string, userId: number) {
		try {
			const hash = await argon.hash(pwd);
			await this.prisma.user.update({
				where: { id: userId },
				data: { hash : hash },
			});
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
				throw new UnauthorizedException('Nickname is already taken. Please choose a different nickname.');
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
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === 'P2002' &&
				Array.isArray((error.meta as any)?.target) &&
				(error.meta as any)?.target.includes('email')
			) {
				throw new UnauthorizedException('Email is already taken. Please choose a different email.');
			}
			// Handle other errors or re-throw if needed.
			throw error;
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
		} catch (error) {
		  	console.error('Error updating 2FA:', error);
		}
	}

	async uploadAvatar(file: any,  userId: number) {
		try {
			await this.prisma.user.update({
				where: {id: userId},
				data: { avatar: file.path }
			});
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
	// UPDATES USER BLOCKED ========================================================
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
			return updateBlockedUsers;
		} catch (error) {
		  	console.error(error);
			  throw new Error(error);
		}
	}

	// =============================================================================
	// UPDATES USER AS A FRIEND ====================================================
	async updateAddFriend(userId: number, currentUserId: number, friend: boolean) {
		try {
			const updateAddFriend = await this.prisma.user.update({
				where: { id: currentUserId },
				data: {
					friend: {
						connect: (friend ? {id: userId}: undefined),
						disconnect: (!friend ? {id: userId}: undefined)
					}
				},
		  	});
			return updateAddFriend;
		} catch (error) {
		  	console.error(error);
			  throw new Error(error);
		}
	}
}



