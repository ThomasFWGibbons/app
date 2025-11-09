
// FILE: test/app.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
// FIX: Import jest functions to fix type errors.
import { describe, beforeAll, afterAll, it, expect } from '@jest/globals';

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
    }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  it('should return 404 for root', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(404);
  });

  describe('/auth', () => {
    it('/api/v1/auth/login (POST) should fail with bad credentials for non-existent user', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'test@test.com', password: 'password' })
        .expect(401); // Unauthorized
    });
  });
});
