import { Controller, ForbiddenException, Get, Param, UseGuards, Post, Body, HttpCode, HttpStatus,  UploadedFile, UseInterceptors } from "@nestjs/common";
import { User } from '@prisma/client'; //User Typescript type generated by Prisma
import { JwtGuard } from "../auth/guard";
import * as multer from 'multer';
import { GetUser } from "../auth/decorator"
import { UserService } from "./user.service";
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'; 
import { MulterConfig } from './middlewares';

@UseGuards(JwtGuard) //link this custom guard (check for jwt token for every user route of this controller) to our strategy named 'jwt' in file jwt.strategy.ts. 
@Controller('users') // définit la route "/users" de l'API
export class UserController {
	constructor (
		private userService: UserService
	) {}

	// =============================================================================
	// GETTERS =====================================================================
	
	@Get()
	getUsers() {
		// console.log(this.userService.getUsers())
		return (this.userService.getUsers());
	}
	
	@HttpCode(HttpStatus.OK)
	@Get('me') // GET /users/me
    async getMe(
        @GetUser() user: any
    ) {
        console.log({ user });
        return await this.userService.getMe(user.sub);
    }
 
	@Get(':id') //see nestjs doc on route parameters : https://docs.nestjs.com/controllers#route-parameters
	getUser(@Param('id') id: string) {
		console.log({id});
		const userId = parseInt(id);
		if ((isNaN(userId))) throw new ForbiddenException("incorrect id sent : not a number");
		const user = this.userService.getUser(userId);
		if (!user) {
			throw new ForbiddenException("No user found with given id");
		}
		console.log({user});
		return (user);
	}

	@HttpCode(HttpStatus.OK)
	@Get('score')
	async getScore(
		@GetUser() user
	) {
		console.log({user});
		const score = await this.userService.getScore(user.sub);
  		return { score: score }; 
	}

	// @HttpCode(HttpStatus.OK)
	@Get('auth2fa')
	async getAuth2fa(
		@Body() dto: any,
	) {
		console.log ({dto});
		const auth2fa = await this.userService.getAuth2fa(dto.email)
		return {auth2fa: auth2fa};
	}

	// =============================================================================
	// UPDATES =====================================================================
	@HttpCode(HttpStatus.OK)
	@Post('score')
	async updateScore(
		  @Body() body: { score: number },
		  @GetUser() user
		) {
			const { score } = body;
			console.log({score});
			console.log({user});
			await this.userService.updateScore(score, user.sub);
	}

	@HttpCode(HttpStatus.OK)
	@Post('email')
	async updateEmail(
		@Body() body: { email: string },
		@GetUser() user
		) {
			const { email } = body;
			console.log(`new Email = ${email}`);
			await this.userService.updateEmail(email, user.sub);
	}

	@HttpCode(HttpStatus.OK)
	@Post('pwd')
	async updatePwd(
		@Body() body: { pwd: string },
		@GetUser() user
		) {
			const { pwd } = body;
			console.log(`new Pwd = ${pwd}`);
			await this.userService.updatePwd(pwd, user.sub);
	}

	@HttpCode(HttpStatus.OK)
	@Post('updateNick')
	async updateNick(
		@Body() body: { nickname: string },
		@GetUser() user 
		) {
			const { nickname } = body;
			console.log(`new Nick = ${nickname}`);
			await this.userService.updateNick(nickname, user.sub);
	}


	//NOT USED 
	@HttpCode(HttpStatus.OK)
	@Post('updateUser')
	async updateUser(
		@Body() updateData: { score?: number, email?: string },
		@GetUser() user
		) {
			const { score, email } = updateData;
			try {
				await this.userService.updateUser(user.sub, { score, email });
		
				if (score !== undefined) {
					console.log(`Score updated successfully for user with ID: ${user.sub}`);
				}
				if (email !== undefined) {
					console.log(`Email updated successfully for user with ID: ${user.sub}`);
				}
				return { message: 'User updated successfully' };

			} catch (error) {
					console.error('Error updating user:', error);
					return { message: 'Error updating user' };
			}
	}

	@HttpCode(HttpStatus.OK)
	@Post('update2fa')
	async update2fa(
		@Body() body: {auth2fa: boolean},
		@GetUser() user
	) {
		const { auth2fa } = body;
		console.log(`Auth2fa = ${auth2fa}`);
		await this.userService.update2fa(auth2fa, user.sub);
	}

	@HttpCode(HttpStatus.OK)
	@Post('uploadAvatar')
	@UseInterceptors(
		FileInterceptor('avatar', MulterConfig)
	)
	async uploadAvatar(
		// @Body() body: {avatar: string},
		@UploadedFile() file: any,
		@GetUser() user
	) {

		console.log(`Avatar file = ${file}`);
		await this.userService.uploadAvatar(file, user.sub);
	}

	// @Post('uploadAvatar')
	// @UseInterceptors(FileInterceptor('avatar')) // 'avatar' should match the field name in the FormData
	// async uploadAvatar(
	// 	@UploadedFile() avatar: Express.Multer.File, // Use UploadedFile decorator
	// 	@GetUser() user
	// ) {
	// 	console.log(`Uploaded Avatar = ${avatar.filename}`);
	// 	await this.userService.uploadAvatar(avatar.path, user.sub);
	// }

	@Post('block/:id')
	async blockUser(
		@GetUser() me,
		@Body() dto : {block: boolean},
		@Param('id') id: string,
	) {
		console.log("blockUser controller")
		const userId = parseInt(id);
		if ((isNaN(userId)))
			throw new ForbiddenException("incorrect id sent : not a number");
		
		console.log({me}, {userId});
		return (this.userService.updateBlockedUsers(userId, me.sub, dto.block));		
	}

	@Post ('add-friend/:id')
	async addFriend(
		@GetUser() me,
		@Body() dto: {friend: boolean},
		@Param('id') id: string,
	){
		console.log("addFriend controller")
		const userId = parseInt(id);
		if (isNaN(userId)) {
			throw new ForbiddenException("Incorrect id sent: not a number");
		  }
		console.log({me}, {userId});
		return (this.userService.updateAddFriend(userId, me.sub, dto.friend)); 
	}
}
