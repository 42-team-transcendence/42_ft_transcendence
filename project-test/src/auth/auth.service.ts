import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthoDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}
    //TODO check away + async
    async signup(dto: AuthoDto) {

        // generate the password hash
        const hash = await argon.hash(dto.password);

        // save the new user in the db
        try {
            const user = await this.prisma.user.create({
                data: {
                    nickName: dto.nickName,
                    email: dto.email,
                    hash }
            });
            delete user.hash;
            //return the save user
            return "user";
            
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken',);
                }
            }
            console.log(error);
            throw error;
        }
    }

    signin() {
        return "I have signed in";
    }
}