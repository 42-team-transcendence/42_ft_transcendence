import { IsNotEmpty, IsString, } from "class-validator";

export class DoubleAuthDto {

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
	otp: string;
}
