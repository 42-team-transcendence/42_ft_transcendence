import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthDto {
    @IsString()
    @IsNotEmpty()
    nickname:   string;

    @IsEmail()
    @IsNotEmpty()
    email:      string;

    @IsString()
    @IsNotEmpty()
    password:   string;
}