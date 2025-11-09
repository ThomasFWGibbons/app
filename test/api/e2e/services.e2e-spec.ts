// FILE: test/api/e2e/services.e2e-spec.ts
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { createTestApp } from '../utils/test-app';
import { seedTestData } from '../fixtures/seeds';
import { generateTestJwt } from '../utils/jwt';
import { describe, beforeAll, afterAll, it, expect } from '@jest/globals';

describe('ServicesController (e2e)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient();

  let ownerToken: string;
  let memberToken: string;
  let tenantId: string;
  let otherTenantId: string;

  beforeAll(async () => {
    await prisma.$connect();
    const seed = await seedTestData(prisma);
    app = await createTestApp();

    // Generate JWTs for different roles and tenants from the seeded data
    tenantId = seed.tenant.id;
    otherTenantId = seed.otherTenant.id;
    ownerToken = generateTestJwt(seed.ownerUser.id, seed.ownerUser.email, tenantId, 'owner');
    memberToken = generateTestJwt(seed.memberUser.id, seed.memberUser.email, tenantId, 'member');
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  const servicePayload = {
    name: 'E2E Deep Tissue Massage',
    type: 'appointment' as const,
    duration_minutes: 60,
    price_cents: 9000,
  };

  describe('/tenants/{tenantId}/services (POST)', () => {
    it('should allow an owner to create a service in their own tenant (RBAC)', () => {
      return request(app.getHttpServer())
        .post(`/api/v1/tenants/${tenantId}/services`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(servicePayload)
        .expect(201)
        .then((res) => {
          expect(res.body.name).toEqual(servicePayload.name);
          expect(res.body.tenantId).toEqual(tenantId);
        });
    });

    it('should forbid a member from creating a service (RBAC)', () => {
      // Assuming a RolesGuard is implemented, this should return 403 Forbidden.
      return request(app.getHttpServer())
        .post(`/api/v1/tenants/${tenantId}/services`)
        .set('Authorization', `Bearer ${memberToken}`)
        .send(servicePayload)
        .expect(403);
    });

    it('should prevent an owner from creating a service in another tenant (API-level check)', () => {
      // The owner of `tenantId` attempts to create a service using `otherTenantId` in the URL.
      // The controller's guard/interceptor should reject this before it reaches the service.
      return request(app.getHttpServer())
        .post(`/api/v1/tenants/${otherTenantId}/services`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(servicePayload)
        .expect(403);
    });
  });

  describe('/tenants/{tenantId}/services (GET)', () => {
    beforeAll(async () => {
      // Ensure services exist for both tenants for a predictable result
      await prisma.service.create({ data: { ...servicePayload, tenantId } });
      await prisma.service.create({ data: { ...servicePayload, name: 'Other Tenant Service', tenantId: otherTenantId } });
    });

    it('should allow a member to list services for their own tenant', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/tenants/${tenantId}/services`)
        .set('Authorization', `Bearer ${memberToken}`)
        .expect(200)
        .then((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body.every(s => s.tenantId === tenantId)).toBe(true);
        });
    });

    it('should return an empty array when trying to list services for another tenant (RLS)', () => {
      // A user (member/owner) from `tenantId` tries to list services from `otherTenantId`.
      // The RLS policy in the database should filter out all records, resulting in an empty list.
      return request(app.getHttpServer())
        .get(`/api/v1/tenants/${otherTenantId}/services`)
        .set('Authorization', `Bearer ${memberToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual([]);
        });
    });
  });
});
