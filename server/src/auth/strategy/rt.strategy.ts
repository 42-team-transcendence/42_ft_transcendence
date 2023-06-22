import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { Request } from "express";

@Injectable()
export class RtJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor (config : ConfigService, private prisma : PrismaService) {
        super ({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //recuperation auto du token dans les headers lors d'une requete
            secretOrKey: config.get('REFRESH_SECRET'),
            passReqToCallback: true,
        })
    };

    //sert à extraire les données du jwt et à les comparer à la DB pour valider le user
    //tout ce qui est retourné avec la fonction validate est passée aux fonctions suivantes
    // via l'objet request d'Express, dans l'objet "user"
    async validate(req: Request, payload : {
        sub : number,
        email : string
    }) {
        console.log({payload});
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub,
            },
        });
        const refresh_token = req.get('authorization').replace('Bearer', '').trim();
        console.log({user});
        delete user.hash;
        return user;
    };
}