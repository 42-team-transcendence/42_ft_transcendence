import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as cors from 'cors'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //TODO : vérifier pourquoi enableCors ne fonctionne pas
  // app.enableCors({
  //   origin: true,
  //   methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
  //   allowedHeaders: ['Content-Type', 'Authorization'],
  // });

  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }))

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(3333);
}
bootstrap();