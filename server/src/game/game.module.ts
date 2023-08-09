import { Module } from "@nestjs/common";
import GameGateway from "./game.gateway";

@Module({
    // imports: [JwtModule.register({})],
    providers: [GameGateway],
})

export class GameModule{}