// FILE: test/api/utils/test-app.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { AppModule } from '../../../src/app.module';

export async function createTestApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();

  // Raw body is required for Stripe signature verification.
  // We apply it only to the specific webhook route.
  app.use('/api/v1/webhooks/stripe', bodyParser.raw({ type: '*/*' }));
  
  // The JSON parser is needed for all other routes.
  app.use(bodyParser.json());

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
