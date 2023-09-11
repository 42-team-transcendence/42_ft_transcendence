import { IsNotEmpty, IsString, } from "class-validator";

export class Enable2faDto {

    @IsNotEmpty()
    @IsString()
    email: string;
}
