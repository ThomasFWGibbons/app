// FILE: tests/api/utils/test-app.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../../src/app.module';
import { json } from 'express';
import { Buffer } from 'buffer';

export const createTestApp = async (): Promise<INestApplication> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication({
    // Disable Nest's default body parser to allow for conditional raw body processing.
    bodyParser: false,
  });

  // Use a conditional middleware to handle raw body for the Stripe webhook route
  // and the standard JSON body parser for all other routes. This is crucial for
  // Stripe signature verification which requires the raw, unparsed request body.
  app.use((req, res, next) => {
    if (req.path === '/api/v1/webhooks/stripe') {
      json({
        verify: (req: any, res, buffer) => {
          // Attach the raw buffer to the request object
          if (Buffer.isBuffer(buffer)) {
            req.rawBody = Buffer.from(buffer);
          }
          return true;
        },
      })(req, res, next);
    } else {
      json()(req, res, next);
    }
  });

  // Apply global settings consistent with the main application
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.init();
  return app;
};
