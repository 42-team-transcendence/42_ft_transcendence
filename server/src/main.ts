import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as cors from 'cors'
import * as cookieParser from 'cookie-parser';
import { ConfigService } from "@nestjs/config";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Transcendence 42 project')
    .setDescription('our API to play PONG game')
    .setVersion('1.0')
    .addTag('transcendence')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);

  //URL : http://localhost:3333/api
  SwaggerModule.setup('api', app, document);

  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }))

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('BACKEND_PORT') || 3333;
  await app.listen(port);
}
bootstrap();