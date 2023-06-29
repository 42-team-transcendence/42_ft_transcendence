import { Controller, Post , Body, HttpCode, HttpStatus, UseGuards, Res, Response} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { AuthDto, SignInAuthDto } from "./dto";
import { JwtGuard } from "./guard";
import { Tokens } from "./types";
import { RtGuard } from "./guard/rt.guard";
import { GetUser } from "../auth/decorator"
import { User } from '@prisma/client'; //User Typescript type generated by Prisma

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}


    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    signup(
        @Body() dto: AuthDto,
        @Res()/*({ passthrough: true })*/ res: Response
    ) {
        console.log(dto);
        return (this.authService.signup(dto, res));
    }

    @Post('signin')
    @HttpCode(HttpStatus.OK)
    signin(
        @Body() dto: SignInAuthDto,
        @Res(/*({ passthrough: true })*/) res: Response 
    ) {
        return (this.authService.signin(dto, res));

    }

    @UseGuards(JwtGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@GetUser() user,
            @Res(/*({ passthrough: true })*/) res: Response   
    ) {
        console.log({"controller": user});
        return (this.authService.logout(user.sub, res));
    }

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
}