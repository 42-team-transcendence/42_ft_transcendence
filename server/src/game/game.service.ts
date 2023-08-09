import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma, User, Game } from "@prisma/client";
import { GameDto } from "./dto/game.dto";


@Injectable()
export class GameService {
	constructor(
        private prisma: PrismaService,
    ) {}

	// async createGame(gameDto: GameDto) {
	async createGame(gameDto) {
		console.log({gameDto});
		const data = await this.prisma.game.create({ 
			data: {
				player_1_id: gameDto.winnerId,
				player_2_id: gameDto.loserId,
			}
		});
		console.log(data)
		return data
	}

}