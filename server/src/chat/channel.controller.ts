import { Controller, ForbiddenException, Get, Post, UseGuards, Body, Param, } from "@nestjs/common";
import { JwtGuard } from "../auth/guard";
import { GetUser } from "../auth/decorator"
import { ChannelService } from "./channel.service";
import { CreateChatDto } from "./dto";

@UseGuards(JwtGuard) //link this custom guard (check for jwt token for every user route of this controller) to our strategy named 'jwt' in file jwt.strategy.ts.
@Controller('channels') // définit la route "/channels" de l'API
export class ChannelController {
	constructor (
		private channelService: ChannelService
	) {}

	@Post('create')
	createChannel(
		@GetUser() creator,
        @Body() payload,
    ) {
		console.log("create channel controller")
		return (this.channelService.createChannel(payload, creator.sub));
	}

	@Get('getByName/:input') //see nestjs doc on route parameters : https://docs.nestjs.com/controllers#route-parameters
	getChannelsByName(@Param('input') input: string) {
		console.log({input});
		return (this.channelService.getChannelsByName(input));
	}
}
