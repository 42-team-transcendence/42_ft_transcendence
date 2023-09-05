import { ChannelStatus } from "@prisma/client";
import { ValidateIf, IsNotEmpty, IsNumber, IsString, IsArray, ArrayNotEmpty, isString, isEnum, IsEnum, IsOptional, isNotEmpty } from "class-validator";

export class FindOrCreateChatDto {
    @IsArray()
    @ArrayNotEmpty()
    recipients: number[];
}

export class CreateChannelDto {
    @IsString()
    name: string;
    
    @IsEnum(ChannelStatus)
    status: ChannelStatus;
    
    @ValidateIf(o => o.status === 'PROTECTED')
    @IsString()
    @IsNotEmpty()
    password: string;
}