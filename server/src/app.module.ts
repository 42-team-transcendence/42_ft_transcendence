import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({ //permet d'utiliser des variables d'env avec notre .env
      isGlobal: true //permet d'utiliser ce module dans tous nos autres modules
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    HttpModule
  ],
})
export class AppModule {}