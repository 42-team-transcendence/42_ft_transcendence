import { Controller, Post , Body, HttpCode, HttpStatus} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto, SignInAuthDto } from "./dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    signup(@Body() dto: AuthDto) {
        console.log(dto);
        return (this.authService.signup(dto));
    }

    @HttpCode(HttpStatus.OK)
    @Post('signin')
    signin(@Body() dto: SignInAuthDto) {
        return (this.authService.signin(dto));
    }
}