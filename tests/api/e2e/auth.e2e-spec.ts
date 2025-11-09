// FILE: tests/api/e2e/auth.e2e-spec.ts
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestApp } from '../utils/test-app';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns 401 for bad credentials', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'nope@example.com', password: 'wrong' })
      .expect(401);
  });

  // If your API supports register → login, you can expand with a happy path later.
});
