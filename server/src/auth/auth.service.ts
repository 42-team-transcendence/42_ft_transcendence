import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto, SignInAuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Tokens } from "./types";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService
    ) {}
    //TODO check away + async
    async signup(dto: AuthDto): Promise<Tokens> {

        // generate the password hash
        const hash = await argon.hash(dto.password);

        // save the new user in the db
        try {
            const user = await this.prisma.user.create({
                data: {
                    nickname: dto.nickname,
                    email: dto.email,
                    hash }
            });
            
            // Creation du access_token et du refresh_token
            const tokens = await this.getToken(user.id, user.email);
            // Stockage du refresh_token dans la DB
            await this.updateRtHash(user.id, tokens.refresh_token);
            return (tokens);
            
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ForbiddenException('Credentials taken',);
            }
            console.log(error);
            throw error;
        }
    }

    async signin(dto : SignInAuthDto): Promise<Tokens> {
        //find user by email
        const user = await this.prisma.user.findUnique({
            where: {
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
        // Creation du access_token et du refresh_token
        const tokens = await this.getToken(user.id, user.email);
        // Stockage du refresh_token dans la DB
        await this.updateRtHash(user.id, tokens.refresh_token);
        return (tokens);
    }

    //Création du JWT à partir des infos du user
    //qui servira à authentifier la personne après qu'elle se soit connectée une 1ere fois
    //this is an asynchroneous function returning a promise
    async getToken(userId: number, email: string) {
        const payload = {
            sub: userId,
            email
        }

        const secret = this.config.get('JWT_SECRET');
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: secret //après 15min, le user devra à nouveau se connecter
        })

        const refresh_secret = this.config.get('REFRESH_SECRET');
        const refresh_token = await this.jwt.signAsync(payload, {
            expiresIn: '15d',
            secret: refresh_secret //après 15jours, le user devra à nouveau se connecter
        })

        return { access_token : token, refresh_token}
    }


    async updateRtHash(userId: number, rt: string) {
        // Transforme le refresh_token en hash
        const hash = await argon.hash(rt);
        // Stock le hash dans la DATABASE
        await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                hashedRt: hash,
            },
        });
    }


    async logout(userId: number) {
        await this.prisma.user.updateMany({
            where: {
                id: userId,
                hashedRt: {
                    not: null
                },
            },
            data: {
                hashedRt: null
            }
        })
    }

    async refresh(userId: number, rt: string) {
        console.log({userId, rt})
        const user = await this.prisma.user.findUnique({
            where : {
                id: userId,
            },
        });
        if (!user) throw new ForbiddenException("Credentials incorrect");

        const rtMatches = await argon.verify(user.hashedRt, rt);
        if (!rtMatches) throw new ForbiddenException("Credentials incorrect");

        // Creation du access_token et du refresh_token
        const tokens = await this.getToken(user.id, user.email);
        // Stockage du refresh_token dans la Database
        await this.updateRtHash(user.id, tokens.refresh_token);
        return (tokens);
    }
}