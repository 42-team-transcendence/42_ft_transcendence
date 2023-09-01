import { Controller, ForbiddenException, Get, Post, UseGuards, Body, Param, } from "@nestjs/common";
import { JwtGuard } from "../auth/guard";
import { GetUser } from "../auth/decorator"
import { ChannelService } from "./channel.service";
import { ChatService } from "./chat.service";

@UseGuards(JwtGuard) //link this custom guard (check for jwt token for every user route of this controller) to our strategy named 'jwt' in file jwt.strategy.ts.
@Controller('channels') // définit la route "/channels" de l'API
export class ChannelController {
	constructor (
		private channelService: ChannelService,
		private chatService: ChatService,
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

	@Post('join/:id')
	async joinChannel(
		@GetUser() user,
		@Param('id') id: string
    ) {
		try {
			const channelId = parseInt(id);
			if ((isNaN(channelId)))
				throw new ForbiddenException("incorrect id sent : not a number");
			
			const chat = await this.chatService.findChatById(channelId);
			if (chat.channelInfo.bannedUsers.find((e:any)=>e.id === user.sub))
				throw new ForbiddenException(`user is banned from channel ${chat.channelInfo.name}`);
			return (this.channelService.joinChannel(channelId, user.sub));
		} catch (error) {
			throw error;
		}
	}

	@Post('update/:id')
	updateChannelInfos(
		@GetUser() user,
		@Param('id') id: string,
		@Body() payload
    ) {
		console.log("update channel controller")
		const channelId = parseInt(id);
		if ((isNaN(channelId)))
			throw new ForbiddenException("incorrect id sent : not a number");
		console.log(user, channelId, payload);
		return (this.channelService.updateChannelInfos(channelId, user.sub, payload));
	}

	@Post('updateMutes/:id')
	updateChannelMutedUsers(
		@GetUser() user,
		@Param('id') id: string,
		@Body() payload
    ) {
		console.log("updateMutes controller")
		const channelId = parseInt(id);
		if ((isNaN(channelId)))
			throw new ForbiddenException("incorrect id sent : not a number");
		console.log({user}, {channelId}, {payload});
		
		if (payload.oldMuted)
			return this.channelService.deleteChannelMutedUser(payload.channelInfoId, payload.oldMuted)
		return (this.channelService.upsertChannelMutedUsers(channelId, user.sub, payload));
	}
}