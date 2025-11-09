// FILE: tests/api/e2e/services.e2e-spec.ts
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { createTestApp } from '../utils/test-app';
import { generateTestJwt } from '../utils/jwt';

describe('Services (e2e)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient();
  let ownerToken: string;
  let tenantId: string;

  beforeAll(async () => {
    app = await createTestApp();
    await prisma.$connect();

    // Minimal seed: a tenant + an owner user relation.
    const tenant = await prisma.tenant.create({
      data: {
        name: 'E2E Tenant',
        slug: 'e2e-tenant',
        timezone: 'Europe/London',
        currency: 'GBP',
      },
    });
    tenantId = tenant.id;

    const user = await prisma.user.create({
      data: { email: 'owner@e2e.test', name: 'Owner' },
    });

    await prisma.tenantUser.create({
      data: { tenantId: tenant.id, userId: user.id, role: 'owner' },
    });

    ownerToken = generateTestJwt(user.id, user.email!, tenant.id, 'owner');
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('owner can create a service', async () => {
    const res = await request(app.getHttpServer())
      .post(`/api/v1/tenants/${tenantId}/services`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        name: 'Intro Session',
        type: 'appointment',
        duration_minutes: 60,
        price_cents: 5000,
        capacity: 1,
      })
      .expect(201);

    expect(res.body).toBeDefined();
  });

  it('can list services for the tenant', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/tenants/${tenantId}/services`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });
});
