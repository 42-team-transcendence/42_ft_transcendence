import { Controller, ForbiddenException, Get, Param, UseGuards } from "@nestjs/common";
import { User } from '@prisma/client'; //User Typescript type generated by Prisma
import { JwtGuard } from "../auth/guard";
import { GetUser } from "../auth/decorator"
import { UserService } from "./user.service";

@UseGuards(JwtGuard) //link this custom guard (check for jwt token for every user route of this controller) to our strategy named 'jwt' in file jwt.strategy.ts. 
@Controller('users') // définit la route "/users" de l'API
export class UserController {
	constructor (
		private userService: UserService
	) {}
	
	@Get()
	getUsers() {
		console.log(this.userService.getUsers())
		return (this.userService.getUsers());
	}

	@Get('me') // GET /users/me
    getMe(@GetUser() user: User) {
        return user;
    }

	@Get(':id') //see nestjs doc on route parameters : https://docs.nestjs.com/controllers#route-parameters
	getUser(@Param(':id') id: string) {
		console.log({id});
		const userId = parseInt(id);
		if ((isNaN(userId))) throw new ForbiddenException("incorrect id sent : not a number");
		console.log(this.userService.getUser(userId));
		return (this.userService.getUser(userId));
	}
}