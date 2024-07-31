import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as express from 'express';
import { ENVIRONMENT } from './common/constants/environment/env.variable';
import { HttpExceptionFilter } from './common/filter/filter';
//const cookieSession = require('cookie-session');

async function bootstrap() {
  const { CONNECTION } = ENVIRONMENT;
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  // app.use(
  //   cookieSession({
  //     keys: [COOKIES.KEY],
  //   }),
  // );
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(CONNECTION.PORT);
}
bootstrap();
