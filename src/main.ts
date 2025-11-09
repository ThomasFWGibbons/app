// FILE: src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
     // Disable built-in body parser to handle raw body for Stripe webhooks
    bodyParser: false,
  });

  // Global validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip away properties that do not have any decorators
    transform: true, // Automatically transform payloads to DTO instances
  }));

  // API prefix
  app.setGlobalPrefix('api/v1');
  
  // OpenAPI (Swagger) Documentation
  const config = new DocumentBuilder()
    .setTitle('All-in-One Business & Booking Platform API')
    .setDescription('Core API for the platform.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 4000);
}
bootstrap();