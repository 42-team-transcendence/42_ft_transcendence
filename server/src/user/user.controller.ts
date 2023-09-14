import { Controller, ForbiddenException, Get, Param, UseGuards, Post, Body, HttpCode, HttpStatus,  UploadedFile, UseInterceptors } from "@nestjs/common";
import { User } from '@prisma/client'; //User Typescript type generated by Prisma
import { JwtGuard } from "../auth/guard";
import * as multer from 'multer';
import { GetUser } from "../auth/decorator"
import { UserService } from "./user.service";
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { MulterConfig } from './middlewares';
import { UserDto } from "./dto/user.dto";
import { GetUserDto } from "src/auth/dto";
import { ExcludeSensitiveData } from "src/interceptors/excludeSensitiveDataInterceptor";
import { error } from "console";

// @UseGuards(JwtGuard) //link this custom guard (check for jwt token for every user route of this controller) to our strategy named 'jwt' in file jwt.strategy.ts.
@Controller('users') // définit la route "/users" de l'API
export class UserController {
	constructor (
		private userService: UserService
	) {}

	// =============================================================================
	// GETTERS =====================================================================
	@UseInterceptors(ExcludeSensitiveData)
	@Get('number')
	getUsersNumber() {
		// console.log(this.userService.getUsers())
		return (this.userService.getUsersNumber());
	}
	
	@UseGuards(JwtGuard)
	@UseInterceptors(ExcludeSensitiveData)
	@Get()
	getUsers() {
		// console.log(this.userService.getUsers())
		return (this.userService.getUsers());
	}

	@UseGuards(JwtGuard)
	@UseInterceptors(ExcludeSensitiveData)
	@HttpCode(HttpStatus.OK)
	@Get('me') // GET /users/me
    async getMe(
        @GetUser() user: any
    ) {
        return await this.userService.getMe(user.sub);
    }

	@UseGuards(JwtGuard)
	@UseInterceptors(ExcludeSensitiveData)
	@Get(':id') //see nestjs doc on route parameters : https://docs.nestjs.com/controllers#route-parameters
	getUser(@Param('id') id: string) {
		const userId = parseInt(id);
		if ((isNaN(userId))) throw new ForbiddenException("incorrect id sent : not a number");
		const user = this.userService.getUser(userId);
		if (!user) {
			throw new ForbiddenException("No user found with given id");
		}
		return (user);
	}

	@UseGuards(JwtGuard)
	@UseInterceptors(ExcludeSensitiveData)
	@HttpCode(HttpStatus.OK)
	@Get('score')
	async getScore(
		@GetUser() user
	) {
		const score = await this.userService.getScore(user.sub);
  		return { score: score };
	}

	// @HttpCode(HttpStatus.OK)
	@UseGuards(JwtGuard)
	@Get('auth2fa')
	async getAuth2fa(
		@Body() dto: any,
	) {
		const auth2fa = await this.userService.getAuth2fa(dto.email)
		return {auth2fa: auth2fa};
	}

	// =============================================================================
	// UPDATES =====================================================================
	@UseGuards(JwtGuard)
	@UseInterceptors(ExcludeSensitiveData)
	@HttpCode(HttpStatus.OK)
	@Post('email')
	async updateEmail(
		@Body() dto: UserDto,
		@GetUser() creator: GetUserDto
		) {
			const email  = dto.email;
			try {
				await this.userService.updateEmail(email, creator.sub);
			}
			catch (error) {
				throw error;
			}

	}

	@UseGuards(JwtGuard)
	@UseInterceptors(ExcludeSensitiveData)
	@HttpCode(HttpStatus.OK)
	@Post('pwd')
	async updatePwd(
		@Body() dto: UserDto,
		@GetUser() creator: GetUserDto
		) {
			const pwd = dto.pwd;
			await this.userService.updatePwd(pwd, creator.sub);
	}

	@UseGuards(JwtGuard)
	@UseInterceptors(ExcludeSensitiveData)
	@HttpCode(HttpStatus.OK)
	@Post('updateNick')
	async updateNick(
		@Body() dto: UserDto,
		@GetUser() creator: GetUserDto
		) {
			const nickname = dto.nickname;
			await this.userService.updateNick(nickname, creator.sub);
	}

	@UseGuards(JwtGuard)
	@UseInterceptors(ExcludeSensitiveData)
	@HttpCode(HttpStatus.OK)
	@Post('update2fa')
	async update2fa(
		@Body() dto: UserDto,
		@GetUser() creator: GetUserDto
	) {
		const auth2fa  = dto.auth2fa;
		await this.userService.update2fa(auth2fa, creator.sub);
	}

	@UseGuards(JwtGuard)
	@HttpCode(HttpStatus.OK)
	@Post('uploadAvatar')
	@UseInterceptors(
		FileInterceptor('avatar', MulterConfig)
	)
	async uploadAvatar(
		@UploadedFile() file: any,
		@GetUser() user
	) {
		await this.userService.uploadAvatar(file, user.sub);
	}

	@UseGuards(JwtGuard)
	@UseInterceptors(ExcludeSensitiveData)
	@Post('block/:id')
	async blockUser(
		@GetUser() me,
		@Body() dto : {block: boolean},
		@Param('id') id: string,
	) {
		const userId = parseInt(id);
		if ((isNaN(userId)))
			throw new ForbiddenException("incorrect id sent : not a number");

		return (this.userService.updateBlockedUsers(userId, me.sub, dto.block));
	}

	@UseInterceptors(ExcludeSensitiveData)
	@Post ('add-friend/:id')
	async addFriend(
		@GetUser() me,
		@Body() dto: {friend: boolean},
		@Param('id') id: string,
	){
		const userId = parseInt(id);
		if (isNaN(userId)) {
			throw new ForbiddenException("Incorrect id sent: not a number");
		  }
		return (this.userService.updateAddFriend(userId, me.sub, dto.friend));
	}
}
