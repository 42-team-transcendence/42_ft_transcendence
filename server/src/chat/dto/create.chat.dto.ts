import { Message, User } from "@prisma/client";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
// import { Participant } from "../chat";

export class CreateChatDto {
    // @IsString()
    // messages?: Message[];

    participantIds : number[];
}