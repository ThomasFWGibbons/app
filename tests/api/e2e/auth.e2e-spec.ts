// FILE: tests/api/e2e/auth.e2e-spec.ts
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { createTestApp } from '../utils/test-app';
import { seedTestData } from '../fixtures/seeds';
import { describe, beforeAll, afterAll, it, expect } from '@jest/globals';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient();

  beforeAll(async () => {
    // Connect to the database and seed it with test data
    await prisma.$connect();
    await seedTestData(prisma);
    // Bootstrap the NestJS application
    app = await createTestApp();
  });

  afterAll(async () => {
    // Close the app and database connections
    await app.close();
    await prisma.$disconnect();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user successfully', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'new-e2e-user@example.com',
          password: 'password123',
        })
        .expect(201)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.email).toEqual('new-e2e-user@example.com');
          expect(res.body.password).toBeUndefined(); // Ensure password is not returned
        });
    });

    it('should return 409 Conflict when trying to register with an existing email', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'owner-test@example.com', // This email is seeded by seedTestData
          password: 'password123',
        })
        .expect(409);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login an existing user and return a JWT', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'owner-test@example.com', // This user is seeded
          password: 'password123',
        })
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(typeof res.body.access_token).toBe('string');
        });
    });

    it('should return 401 Unauthorized for incorrect password', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'owner-test@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });

    it('should return 401 Unauthorized for a non-existent user', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'ghost@example.com',
          password: 'password123',
        })
        .expect(401);
    });
  });
});
