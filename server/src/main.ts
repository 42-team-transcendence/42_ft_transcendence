import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as cors from 'cors'
import * as cookieParser from 'cookie-parser';
import { ConfigService } from "@nestjs/config";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { SanitizePipe } from './sanitize.pipe';

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

  // Supprimer les cookies ici
  app.use((req, res, next) => {
    // Vous pouvez supprimer des cookies en utilisant res.clearCookie() pour chaque cookie que vous souhaitez supprimer.
    // Par exemple, pour supprimer un cookie nommé 'monCookie', vous pouvez faire :
    res.clearCookie('refreshToken');
    // Répétez cette instruction pour chaque cookie que vous souhaitez supprimer.

    // Ensuite, continuez à gérer la requête comme d'habitude
    next();
  });

  // Apply the SanitizePipe and the validationPipe globally
  app.useGlobalPipes(
    // new SanitizePipe(),
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('BACKEND_PORT') || 3333;
  await app.listen(port);
}
bootstrap();
