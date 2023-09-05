import { ChannelStatus } from "@prisma/client";
import { ValidateIf, IsNotEmpty, IsNumber, IsString, IsArray, ArrayNotEmpty, isString, isEnum, IsEnum, IsOptional, isNotEmpty } from "class-validator";

export class UpdateChannelDto {
    @IsOptional()
    @IsString()
    name: string;
    
    @IsOptional()
    @IsEnum(ChannelStatus)
    status: ChannelStatus;
    
    @ValidateIf(o => o.status === 'PROTECTED')
    @IsString()
    @IsNotEmpty()
    password: string;

    @IsOptional()
    @IsNumber()
    oldParticipant: number

    @IsOptional()
    @IsNumber()
    newParticipant: number

    @IsOptional()
    @IsNumber()
    oldAdmin: number;

    @IsOptional()
    @IsNumber()
    newAdmin: number;

    @IsOptional()
    @IsNumber()
    oldBanned: number;

    @IsOptional()
    @IsNumber()
    newBanned: number;
}

export class UpdateChannelMutedDto {
    @IsOptional()
    @IsNumber()
    oldMuted: number;

    @IsOptional()
    @IsNumber()
    newMuted: number;

    @IsNumber()
    channelInfoId: number;
}