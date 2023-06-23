import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { Request } from "express";
import { JwtPayload, JwtPayloadWithRt } from "../types";

//Explication des stratégies passeport ici https://docs.nestjs.com/recipes/passport
@Injectable()
export class RtJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor (config : ConfigService, private prisma : PrismaService) {
        super ({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //recuperation auto du token dans les headers lors d'une requete
            secretOrKey: config.get<string>('REFRESH_SECRET'),
            passReqToCallback: true,
        })
    };

    //tout ce qui est retourné avec la fonction validate est passée aux fonctions suivantes
    // via l'objet request d'Express, dans l'objet "user"
    validate(req: Request, payload : JwtPayload): JwtPayloadWithRt {
        console.log({payload});

        const refreshToken = req?.get('authorization')?.replace('Bearer', '').trim();
        if (!refreshToken) throw new ForbiddenException('Refresh token malformed');

		//passport inclus le retour de la méthode validate dans l'objet request (qui pourra ensuite être
        // récupéré par d'autres méthodes/fonctions)
        return {
            ...payload,
            refreshToken,
        };
    }
}