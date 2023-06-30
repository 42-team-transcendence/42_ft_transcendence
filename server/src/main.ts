import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as cors from 'cors'
import * as cookieParser from 'cookie-parser';
import { ConfigService } from "@nestjs/config";


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const httpService = app.get(HttpService);
  // // const moduleRef = app.get(ModuleRef);

  // const axiosInstance = httpService.axiosRef;
  // axiosInstance.defaults.headers['Access-Control-Allow-Origin'] = '*';
  // axiosInstance.defaults.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS';
  // axiosInstance.defaults.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';

  // app.enableCors();

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