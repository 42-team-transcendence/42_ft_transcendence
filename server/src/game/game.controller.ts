import { Controller, Get, Post, UseInterceptors, HttpStatus, Body, UseGuards, Param } from "@nestjs/common";
import { JwtGuard } from "../auth/guard";
import { GameService } from "./game.service"
import { GameDto } from "./dto/game.dto";
import { GetUser } from "src/auth/decorator";
import { ExcludeSensitiveData } from "src/interceptors/excludeSensitiveDataInterceptor";


@UseGuards(JwtGuard)
@Controller ('games')
export class GameController {
	constructor (
		private gameService: GameService
	) {}

	// @Post()
  	// // async createGame(@Body() gameDto: GameDto) {
  	// async createGame(@Body() gameDto) {
	// 	console.log({gameDto})
    // 	return this.gameService.createGame(gameDto);
  	// }

	@UseInterceptors(ExcludeSensitiveData)
	@Get('findAllMyGames')
	async findAllMyGames(@GetUser() me) {
		//console.log({me});
		return (this.gameService.findAllMyGames(me));
	}

	@UseInterceptors(ExcludeSensitiveData)
	@Get('findGamesByUserId/:userId')
	async findGamesByUserId(@Param('userId') userId: number) {
		return this.gameService.findGamesByUserId(Number(userId));
	}

	@UseInterceptors(ExcludeSensitiveData)
	@Get('findAllGames')
	async findAllGames(){
		return (this.gameService.findAllGames());
	}
}
