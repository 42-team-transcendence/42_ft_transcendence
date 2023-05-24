import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthoDto } from "./dto";
import * as argon from 'argon2'

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}
    //TODO check away + async
    async signup(dto: AuthoDto) {
        // generate the password hash
        const hash = await argon.hash(dto.password);
        // save the new user in the db
        const user = await this.prisma.user.create({
            data: {
                nickName: dto.nickname,
                email: dto.email,
                hash,
            },
        });

        delete user.hash;
        return user;
    }

    signin() {
        return "I have signed in";
    }
}