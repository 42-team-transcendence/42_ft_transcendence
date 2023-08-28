import { Module } from '@nestjs/common';
import {PublicController} from "./public.controller";
import {UserModule} from "../user/user.module";
import {UserService} from "../user/user.service";

@Module({
    controllers: [PublicController],
    imports: [UserModule],
    providers: [UserService],
})
export class PublicModule {}
