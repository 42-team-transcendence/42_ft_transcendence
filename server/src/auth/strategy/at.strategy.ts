import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtPayload } from "../types/jwtPayload.type";

//Explication des stratégies passeport ici https://docs.nestjs.com/recipes/passport
@Injectable()
export class AtJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	//Lors de l'instanciation, extraction automatique du JWT et vérification de la validité du token
    //SI c'est valide, la classe validate est appelée automatiquement ensuite (comportement défini par passport)
    constructor (config : ConfigService, private prisma : PrismaService) {
        super ({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //recuperation auto du token dans les headers lors d'une requete
            secretOrKey: config.get<string>('JWT_SECRET'),
        })
    };


    //la fonction validate est standard et définie par la classe PassportStrategy
    //sert à extraire les données du jwt et à les comparer à la DB pour valider le user
    //tout ce qui est retourné avec la fonction validate est passée aux fonctions suivantes
    // via l'objet request d'Express, dans l'objet "user"

	validate(payload: JwtPayload) {
		return payload;
	}

    // async validate(payload : JwtPayload): Promise<any> {
    //     console.log({"jwt_payload_validate" : payload});
    //     const user = await this.prisma.user.findUnique({
    //         where: {
    //             id: payload.sub,
    //         },
    //     });
    //     console.log({"jwt_user_validate" : user});
    //     delete user.hash;
    //     return user;
    // };


}