import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import open from 'open';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('puulChallenge API')
    .setDescription('Reto Puul vacante Fullstack')
    .setVersion('1.0')
    .setContact('Eder Avendaño', '', 'ederjavs@gmail.com')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
  await open(`http://localhost:${process.env.PORT ?? 3000}/api`);
}
bootstrap();
