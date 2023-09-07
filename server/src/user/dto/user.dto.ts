import { IsNotEmpty, IsNumber, IsString, IsBoolean } from "class-validator";

export class UserDto {
    @IsNumber()
    score: number;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    pwd: string;

    @IsNotEmpty()
    @IsString()
    nickname: string;

    @IsNotEmpty()
    @IsBoolean()
    auth2fa: boolean;

    @IsNotEmpty()
    @IsString()
    avatar: string;
}
