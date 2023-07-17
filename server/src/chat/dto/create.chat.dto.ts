import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateChatDto {
    @IsNumber()
    @IsNotEmpty()
    authorId: number; //id of the user creating the chat

    @IsNumber()
    @IsNotEmpty()
    recipientId: number;

    @IsNotEmpty()
    @IsString()
    message: string;
}