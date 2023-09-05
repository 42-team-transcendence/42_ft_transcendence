import { ChannelStatus } from "@prisma/client";
import { ValidateIf, IsNotEmpty, IsNumber, IsString, IsArray, ArrayNotEmpty, isString, isEnum, IsEnum, IsOptional, isNotEmpty } from "class-validator";

export class MessageDto {
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsNumber()
    senderId: number;

    @IsNotEmpty()
    @IsNumber()
    chatId: number;
}