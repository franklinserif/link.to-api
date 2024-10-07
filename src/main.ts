import { NestFactory } from '@nestjs/core';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix('api', {
    exclude: [{ path: '/:id', method: RequestMethod.GET }],
  });

  const config = new DocumentBuilder()
    .setTitle('linkto API')
    .setDescription('restfull api for linkto')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(helmet());

  await app.listen(3000);
}
bootstrap();
