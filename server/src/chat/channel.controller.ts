import { Controller, ForbiddenException, Get, Post, UseGuards, Body, Param, ParseIntPipe, UseInterceptors, } from "@nestjs/common";
import { JwtGuard } from "../auth/guard";
import { GetUser } from "../auth/decorator"
import { ChannelService } from "./channel.service";
import { ChatService } from "./chat.service";
import { GetUserDto } from "src/auth/dto";
import { CreateChannelDto, UpdateChannelDto, UpdateChannelMutedDto } from "./dto";
import { ExcludeSensitiveData } from "src/interceptors/excludeSensitiveDataInterceptor";

@UseGuards(JwtGuard) //link this custom guard (check for jwt token for every user route of this controller) to our strategy named 'jwt' in file jwt.strategy.ts.
@Controller('channels') // définit la route "/channels" de l'API
export class ChannelController {
	constructor (
		private channelService: ChannelService,
		private chatService: ChatService,
	) {}

	@UseInterceptors(ExcludeSensitiveData)
	@Post('create')
	createChannel(
		@GetUser() creator: GetUserDto,
        @Body() payload: CreateChannelDto,
    ) {
		return (this.channelService.createChannel(payload, creator.sub));
	}

	@UseInterceptors(ExcludeSensitiveData)
	@Get('getByName/:input') //see nestjs doc on route parameters : https://docs.nestjs.com/controllers#route-parameters
	getChannelsByName(@Param('input') input: string) {
		return (this.channelService.getChannelsByName(input));
	}

	@UseInterceptors(ExcludeSensitiveData)
	@Post('join/:id')
	async joinChannel(
		@GetUser() user: GetUserDto,
		@Param('id', ParseIntPipe) channelId: number,
    ) {
		try {
			const chat = await this.chatService.findChatById(channelId);
			if (chat.channelInfo.bannedUsers.find((e:any)=>e.id === user.sub))
				throw new ForbiddenException(`user is banned from channel ${chat.channelInfo.name}`);
			return (this.channelService.joinChannel(channelId, user.sub));
		} catch (error) {
			throw error;
		}
	}

	@UseInterceptors(ExcludeSensitiveData)
	@Post('update/:id')
	async updateChannelInfos(
		@GetUser() user: GetUserDto,
		@Param('id', ParseIntPipe) channelId: number,
		@Body() payload: UpdateChannelDto
    ) {
		try {
			//check that currentUser is admin
			const isAdmin = await this.channelService.checkIsAdmin(channelId, user.sub)
			if (!isAdmin)
				throw new ForbiddenException('User is not admin of channel',);

			return (this.channelService.updateChannelInfos(channelId, user.sub, payload));
		} catch (error) {
			console.log(error);
			throw error;
		}
	}

	@UseInterceptors(ExcludeSensitiveData)
	@Post('leave/:id')
	async leaveChannel(
		@GetUser() user: GetUserDto,
		@Param('id', ParseIntPipe) channelId: number,
		@Body() payload: UpdateChannelDto
    ) {
		try {
			//check that currentUser is admin
			// const isAdmin = await this.channelService.checkIsAdmin(channelId, user.sub)
			// if (!isAdmin)
			// 	throw new ForbiddenException('User is not admin of channel',);

			return (this.channelService.updateChannelInfos(channelId, user.sub, payload));
		} catch (error) {
			console.log(error);
			throw error;
		}
	}

	@UseInterceptors(ExcludeSensitiveData)
	@Post('updateMutes/:id')
	async updateChannelMutedUsers(
		@GetUser() user: GetUserDto,
		@Param('id', ParseIntPipe) channelId: number,
		@Body() payload: UpdateChannelMutedDto
    ) {
		try {
			//check that currentUser is admin
			const isAdmin = await this.channelService.checkIsAdmin(channelId, user.sub)
			if (!isAdmin)
				throw new ForbiddenException('User is not admin of channel',);

			if (payload.oldMuted)
				return this.channelService.deleteChannelMutedUser(payload.channelInfoId, payload.oldMuted)
			return (this.channelService.upsertChannelMutedUsers(channelId, user.sub, payload));
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
}
