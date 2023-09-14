import { ForbiddenException, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto, SignInAuthDto } from "./dto";
import * as argon from 'argon2';
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Tokens } from "./types";
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService
    ) {}


    // =============================================================================
	// SIGN UP =====================================================================
    async signup(dto: AuthDto, res) {

        // generate the password hash
        const hash = await argon.hash(dto.password);

        // save the new user in the db
        try {
            const user = await this.prisma.user.create({
                data: {
                    nickname: dto.nickname,
                    email: dto.email,
                    hash
                }
            });

            // Creation du accessToken et du refreshToken
            const tokens = await this.getToken(user.id, user.email);
            // Stockage du refreshToken dans la DB
            await this.updateRtHash(user.id, tokens.refreshToken);

            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
            });
            return res.json({accessToken: tokens.accessToken, userId: user.id});

        } catch (error) {
            if (error.code === 'P2002') {
                throw new ForbiddenException('Credentials taken',);
            }
            console.log(error);
            throw error;
        }
    }

	async getUserBymail(userEmail: string){
		try{
			const user = await this.prisma.user.findUnique({
				where: {email: userEmail},
                select: {id: true}
			})
			return (user);
		} catch(error){
			console.error(error)
		}
	}

    async getUserByNick(userNick: string){
		try{
			const user = await this.prisma.user.findUnique({
				where: {nickname: userNick},
                select: {id: true}
			})
			return (user);
		} catch(error){
			console.error(error)
		}
	}


    // =============================================================================
	// SIGN IN =====================================================================
    async signin(dto : SignInAuthDto, res) {
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
        if (user.isOnline)
        {
            return res.json({isOnline : user.isOnline});
        }
        else if (!user.auth2fa) {
            // Creation du accessToken et du refreshToken
            const tokens = await this.getToken(user.id, user.email);
            // Stockage du refreshToken dans la DB
            await this.updateRtHash(user.id, tokens.refreshToken);

            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
            });
            return res.json({accessToken : tokens.accessToken, userId: user.id});
        }
        else {
            return res.json({auth2fa : user.auth2fa});
        }
    }

    async signin2FA(dto : SignInAuthDto, res) {
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
        // Creation du accessToken et du refreshToken
        const tokens = await this.getToken(user.id, user.email);
        // Stockage du refreshToken dans la DB
        await this.updateRtHash(user.id, tokens.refreshToken);

        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
        });
        return res.json({accessToken : tokens.accessToken, userId: user.id});
    }


    // =============================================================================
	// AUTH 42 =====================================================================
    async login_42() {
        let url = 'https://api.intra.42.fr/oauth/authorize';
        url += '?client_id=';
        url += this.config.get('OAUTH_INTRA_CLIENT_ID');
        url += '&redirect_uri=http://localhost:3333/auth/callback/42';
        url += '&response_type=code';
        return ({ url: url });
    }

    async callback42(user, res) {
        if (user == undefined)
            throw (new UnauthorizedException('profile is undefined'));
        const user42 = await this.prisma.user.findFirst({
            where: {
                id: parseInt(user.profile.id),
            },
        });
        if (!user42) {
            const new_hash = crypto.randomBytes(50).toString('hex');
            try {
                await this.prisma.user.create({
                    data: {
                        id: parseInt(user.profile.id),
                        nickname: user.profile.name,
                        email: user.profile.email,
                        hash: new_hash,
                        avatar:  user.profile._json.image.link,
                    }
                });
            } catch (error) {
                // throw new UnauthorizedException('credentials already taken', { cause: new Error(), description: 'credentials already taken' })
                res.redirect('http://localhost:3000/register')
            }
        }
        const new_user = await this.prisma.user.findFirst({
            where: {
                id: parseInt(user.profile.id),
            },
        });

        if(new_user.isOnline) {
            res.redirect('http://localhost:3000/callback42?isOnline=' + new_user.isOnline);
        }
        else if (!new_user.auth2fa) {
            // Creation du accessToken et du refreshToken
            const tokens = await this.getToken(new_user.id, user.profile.email);
            // Stockage du refreshToken dans la DB
            await this.updateRtHash(new_user.id, tokens.refreshToken);

            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
            });
            res.redirect('http://localhost:3000/callback42?token=' + tokens.accessToken + '&email=' + new_user.email + '&id=' + new_user.id + '&isOnline=' + new_user.isOnline);
        }
        else {
            res.redirect('http://localhost:3000/callback42?email=' + new_user.email + '&id=' + new_user.id + '&isOnline=' + new_user.isOnline);
        }
    }

    async callback42_2fa(email: string, res) {

        const user42 = await this.prisma.user.findFirst({
            where: {
                email: email,
            },
        });

        // Creation du accessToken et du refreshToken
        const tokens = await this.getToken(user42.id, user42.email);
        // Stockage du refreshToken dans la DB
        await this.updateRtHash(user42.id, tokens.refreshToken);

        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
        });
        return res.json({accessToken : tokens.accessToken});
    }


    // =============================================================================
	// JWT & REFRESH TOKEN =========================================================

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
            expiresIn: '300m',
            secret: secret //après 15min, le user devra à nouveau se connecter
        })

        const refresh_secret = this.config.get('REFRESH_SECRET');
        const refreshToken = await this.jwt.signAsync(payload, {
            expiresIn: '15d',
            secret: refresh_secret //après 15jours, le user devra à nouveau se connecter
        })

        return { accessToken : token, refreshToken}
    }


    // =============================================================================
	// UPDATE DATABASE =============================================================
    async updateRtHash(userId: number, rt: string) {
        // Transforme le refreshToken en hash
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


    // =============================================================================
	// LOGOUT ======================================================================
    async logout(userId: number, res) {
           await this.prisma.user.updateMany({
                where: {
                    id: userId,
                    //evite de spamer le bouton logout en arretant d'envoyer des requetes apres la 1ere modif.
                    hashedRt: {
                        not: null
                    },
                },
                data: {
                    hashedRt: null
                }
            })
        res.clearCookie('refreshToken');
        return res.send('Vous êtes déconnecté.');
    }


    // =============================================================================
	// REFRESH  ====================================================================
    async refresh(userId: number, rt: string, res) {
        try {
            const user = await this.prisma.user.findUnique({
                where : {
                    id: userId,
                },
            });

            if (!user) throw new ForbiddenException("Credentials incorrect");
            if (!user.hashedRt) throw new ForbiddenException("Credentials incorrect");

            const rtMatches = await argon.verify(user.hashedRt, rt);
            if (!rtMatches) throw new ForbiddenException("Credentials incorrect");

            // Creation du accessToken et du refreshToken
            const tokens = await this.getToken(user.id, user.email);
            // Stockage du refreshToken dans la Database
            await this.updateRtHash(user.id, tokens.refreshToken);

            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
            });

            return res.json({accessToken : tokens.accessToken});
        } catch {
            res.redirect('http://localhost:3000')
        }
    }

}
