import { Controller, Post ,Param, Body, HttpCode, HttpStatus, UseGuards, Res, Req, Response, Get} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { AuthDto, SignInAuthDto } from "./dto";
import { JwtGuard } from "./guard/at.guard";
import { Tokens } from "./types";
import { RtGuard } from "./guard/rt.guard";
import { IntraGuard } from "./guard/intra.guard";
import { GetUser } from "../auth/decorator"
import { User } from '@prisma/client'; //User Typescript type generated by Prisma
import { ConfigService } from "@nestjs/config";
import { ApiTags } from '@nestjs/swagger';
import { DoubleAuthService } from "./doubleauth.service";
import * as speakeasy from 'speakeasy';


@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService,
                private configService: ConfigService,
				private  readonly doubleAuthService: DoubleAuthService,) {}

/*********************************************************************************************************/

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    signup(
        @Body() dto: AuthDto,
        @Res()/*({ passthrough: true })*/ res: Response
    ) {
        console.log(dto);
        return (this.authService.signup(dto, res));
    }

/*********************************************************************************************************/

	@Post('enable-2fa')
	@HttpCode(HttpStatus.CREATED)
	async enable2FA(
		@Body() dto: any,
	) {
        try {
            // Check if the user has already set up 2FA before allowing the setup process again (Optional)
            // You can add an additional check here to prevent users from setting up 2FA multiple times.

            // Generate the 2FA secret and store it in the database
            const secret = speakeasy.generateSecret();
            await this.doubleAuthService.saveUserSecret(dto.email, secret.base32);
            console.log({secret});
            
            // Generate the QR code and return the representation of the QR code in the response
            const qrCodeData = await this.doubleAuthService.generateQRCode(secret.otpauth_url);
            console.log({qrCodeData});
            return ({ qrCodeData });
        } catch (error) {
            console.error('Error enabling 2FA:', error);
            throw new Error('Failed to enable 2FA.');
        }
	}


/*********************************************************************************************************/

    @Post('signin')
    @HttpCode(HttpStatus.OK)
    signin(
        @Body() dto: SignInAuthDto,
        @Res() res: Response
    ) {
        return (this.authService.signin(dto, res));

    }

    @Post('signin2FA')
    @HttpCode(HttpStatus.OK)
    signin2FA(
        @Body() dto: SignInAuthDto,
        @Res() res: Response
    ) {
        return (this.authService.signin2FA(dto, res));
    }

/*********************************************************************************************************/

    @Get('/login/42')
    login_42() {
        return(this.authService.login_42 ())
    }

    @Get('/callback/42')
	@UseGuards(IntraGuard)
	async callback42(@GetUser() user, @Res() res: Response) {
		return (this.authService.callback42(user, res))
	}

	@Get('/userByMail/:email') 
	async getUserBymail(
		@Param('email') email: string
	) {
		//console.log ({email});
		//console.log("email = ",email);
		return (this.authService.getUserBymail(email));
	}

    @Get('/userByNick/:nickname') 
	async getUserByNick(
		@Param('nickname') nickname: string
	) {
		console.log ({nickname});
		//console.log("email = ",email);
		return (this.authService.getUserByNick(nickname));
	}

/*********************************************************************************************************/

    @UseGuards(JwtGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@GetUser() user,
            @Res(/*({ passthrough: true })*/) res: Response
    ) {
        console.log({"controller": user});
        return (this.authService.logout(user.sub, res));
    }

/*********************************************************************************************************/

    @UseGuards(RtGuard) //link this guard (check for refresh token) to our refresh token strategy
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refresh(
        @GetUser() user,
        @Res(/*({ passthrough: true })*/) res: Response
    ) {
        console.log({"controller_user" : user});
        return (this.authService.refresh(user.sub, user.refreshToken, res));
    }

/*************************************************************************************************/
// @Get('/login/id')
// login_42() {
// 	return(this.authService.login_42 ())
// }

}

