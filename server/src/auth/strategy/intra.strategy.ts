import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { Profile } from 'passport';

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy, '42') {
    constructor(private configService: ConfigService) {
        super({
            clientID: configService.get('OAUTH_INTRA_CLIENT_ID'),
            clientSecret: configService.get('OAUTH_INTRA_CLIENT_SECRET'),
            callbackURL: `http://localhost:3333/auth/callback/42`,
            profileFields: {
                id: (obj: any) => {return String(obj.id);},
                name: 'login',
                email: 'email',
            },
        });
    }

    async validate (
        _at: string,
        _rt: string,
        profile: Profile,
    ) {
        if (profile && profile.id && profile.name) {return {profile};}
        else {throw new Error('connect to 42 failed due to invalid profile')}
    }

}