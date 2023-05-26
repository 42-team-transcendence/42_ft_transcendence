import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService
    ) {}
    //TODO check away + async
    async signup(dto: AuthDto) {

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
            
            //return the save user
            return this.signToken(user.id, user.email);
            
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

    async signin(dto : AuthDto) {
        try {//find user by email and nickname
            const user = await this.prisma.user.findFirst({
                where: {
                    nickName : dto.nickName,
                    email : dto.email,
                }
            })
            
            //if user does not exist throw exception
            if (!user) {
                throw new ForbiddenException("Credentials incorrect");
            }

            //check password. if it does not match, throw error
            const pwdMatch = await argon.verify(user.hash, dto.password);
            if (!pwdMatch) {
                throw new ForbiddenException("Credentials incorrect");
            }

            return this.signToken(user.id, user.email);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    //vérification du JWT pour authentifier la personne après qu'elle se soit connectée une 1ere fois
    //this is an asynchroneous function returning a promise
    async signToken(userId: number, email: string) {
        const payload = {
            sub: userId,
            email
        }

        const secret = this.config.get('JWT_SECRET');
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: secret //après 15min, le user devra à nouveau se connecter
        })

        return { access_token : token, }
    }
}