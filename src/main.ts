import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1')
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      }, 'Authorization'
    )
    .addSecurityRequirements('Authorization')
    .setTitle('Micro - Ecommecer')
    .setDescription('Api of online Shopping')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('/',app,document);
  await app.listen(3000);
}
bootstrap();
