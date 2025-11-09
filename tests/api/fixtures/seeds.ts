
// FILE: tests/api/fixtures/seeds.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export const seedTestData = async (prisma: PrismaClient) => {
  const saltRounds = 10;
  const password = await bcrypt.hash('password123', saltRounds);

  // Clean up previous test data to ensure a deterministic state
  await prisma.service.deleteMany();
  await prisma.tenantUser.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const ownerUser = await prisma.user.create({
    data: {
      id: 'cl-owner-user-id', // fixed ID for deterministic tests
      email: 'owner-test@example.com',
      password,
    },
  });

  const memberUser = await prisma.user.create({
    data: {
      id: 'cl-member-user-id',
      email: 'member-test@example.com',
      password,
    },
  });

  // Create tenants
  const tenant = await prisma.tenant.create({
    data: {
      id: 'cl-tenant-id-1',
      name: 'Test Tenant 1',
      slug: 'test-tenant-1',
      users: {
        create: [
          {
            userId: ownerUser.id,
            role: 'owner',
          },
          {
            userId: memberUser.id,
            role: 'member',
          },
        ],
      },
    },
  });
  
  const otherTenant = await prisma.tenant.create({
      data: {
          id: 'cl-tenant-id-2',
          name: 'Other Test Tenant',
          slug: 'other-test-tenant'
      }
  })

  console.log('Test data seeded successfully.');

  return { ownerUser, memberUser, tenant, otherTenant };
};
