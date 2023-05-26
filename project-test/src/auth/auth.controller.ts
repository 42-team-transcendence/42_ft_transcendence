import { Controller, Post , Body} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthoDto } from "./dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    signup(@Body() dto: AuthoDto) {
        console.log(dto);
        return (this.authService.signup(dto));
    }

    @Post('signin')
    signin() {
        return (this.authService.signin());
    }
}