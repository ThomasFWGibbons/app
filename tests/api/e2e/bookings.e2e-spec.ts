// FILE: tests/api/e2e/bookings.e2e-spec.ts
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { createTestApp } from '../utils/test-app';
import { generateTestJwt } from '../utils/jwt';

describe('Bookings (e2e)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient();
  let token: string;
  let tenantId: string;
  let serviceId: string;

  beforeAll(async () => {
    app = await createTestApp();
    await prisma.$connect();

    const tenant = await prisma.tenant.create({
      data: { name: 'Book Tenant', slug: 'book-tenant' },
    });
    tenantId = tenant.id;

    const user = await prisma.user.create({
      data: { email: 'cust@e2e.test', name: 'Customer' },
    });
    await prisma.tenantUser.create({
      data: { tenantId: tenant.id, userId: user.id, role: 'customer' },
    });

    token = generateTestJwt(user.id, user.email!, tenant.id, 'customer');

    const service = await prisma.service.create({
      data: {
        tenantId,
        name: 'Massage',
        type: 'appointment',
        durationMinutes: 30,
        priceCents: 3000,
        capacity: 1,
      },
    });
    serviceId = service.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('creates a booking', async () => {
    const start = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    const end = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();

    const res = await request(app.getHttpServer())
      .post(`/api/v1/bookings`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        tenant_id: tenantId,
        service_id: serviceId,
        start_at: start,
        end_at: end,
        customer_id: undefined, // server can derive from JWT if designed that way
      })
      .expect(201);

    expect(res.body?.id).toBeDefined();

    const confirm = await request(app.getHttpServer())
      .post(`/api/v1/bookings/${res.body.id}/confirm`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(confirm.body?.client_secret || confirm.body?.payment_intent_id).toBeDefined();
  });
});
