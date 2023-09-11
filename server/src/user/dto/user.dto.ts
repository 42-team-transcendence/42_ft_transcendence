import { IsNotEmpty, IsString, IsBoolean, IsOptional } from "class-validator";

export class UserDto {


    @IsOptional()
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    pwd: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    nickname: string;

    @IsOptional()
    @IsNotEmpty()
    @IsBoolean()
    auth2fa: boolean;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    avatar: string;
}
