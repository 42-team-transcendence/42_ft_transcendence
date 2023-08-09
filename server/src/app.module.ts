import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ChatModule } from './chat/chat.module';
import { GameModule } from './game/game.module';
@Module({
  imports: [
    ConfigModule.forRoot({ //permet d'utiliser des variables d'env avec notre .env
      isGlobal: true //permet d'utiliser ce module dans tous nos autres modules
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    HttpModule,
    ChatModule,
    GameModule
  ],
})
export class AppModule {}