import { Controller, Get, Post, HttpCode, HttpStatus, Body, UseGuards } from "@nestjs/common";
import { JwtGuard } from "../auth/guard";
import { GameService } from "./game.service"
import { GameDto } from "./dto/game.dto";
import { GetUser } from "src/auth/decorator";


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

	@Get('findAllMyGames')
	async findAllMyGames(@GetUser() me) {
		//console.log({me});
		return (this.gameService.findAllMyGames(me));
	}
}