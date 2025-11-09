// FILE: tests/app.e2e-spec.ts
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestApp } from './api/utils/test-app';

describe('App (smoke e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('is up', async () => {
    expect(app).toBeDefined();
  });

  it('returns 404 for /', async () => {
    await request(app.getHttpServer()).get('/').expect(404);
  });
});
