import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class GetUserDto {
    @IsNumber()
    @IsNotEmpty()
    sub: number;

    @IsString()
    refreshToken: string;
}