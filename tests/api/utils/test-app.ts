// FILE: tests/api/utils/test-app.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { AppModule } from '../../../src/app.module';

export async function createTestApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();

  // Stripe requires raw body for signature verification.
  app.use('/api/v1/webhooks/stripe', bodyParser.raw({ type: '*/*' }));

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  await app.init();
  return app;
}
