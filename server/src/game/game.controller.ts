import { Controller, Get, Post, HttpCode, HttpStatus, Body, UseGuards } from "@nestjs/common";
import { JwtGuard } from "../auth/guard";
import { GameService } from "./game.service"
import { GameDto } from "./dto/game.dto";


@UseGuards(JwtGuard) 
@Controller ('game')
export class GameController {
	constructor (
		private gameService: GameService
	) {}
	
	@Post()
  	// async createGame(@Body() gameDto: GameDto) {
  	async createGame(@Body() gameDto) {
		console.log({gameDto})
    	return this.gameService.createGame(gameDto);
  	}
}