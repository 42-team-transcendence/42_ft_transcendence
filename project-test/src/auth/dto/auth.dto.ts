import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthoDto {
    @IsString()
    @IsNotEmpty()
    nickName:   string;

    @IsEmail()
    @IsNotEmpty()
    email:      string;

    @IsString()
    @IsNotEmpty()
    password:   string;
}