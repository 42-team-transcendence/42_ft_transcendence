import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { AtJwtStrategy, RtJwtStrategy } from "./strategy";
import { IntraStrategy } from "./strategy/intra.strategy";
import { DoubleAuthService } from './doubleauth.service';


@Module({
    imports: [JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService, AtJwtStrategy, RtJwtStrategy, IntraStrategy, DoubleAuthService],
})

export class AuthModule{}
