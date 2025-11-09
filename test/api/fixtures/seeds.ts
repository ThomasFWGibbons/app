
// FILE: test/api/fixtures/seeds.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export const seedTestData = async (prisma: PrismaClient) => {
  const saltRounds = 10;
  const password = await bcrypt.hash('password123', saltRounds);

  // Clean up previous test data
  await prisma.service.deleteMany();
  await prisma.tenantUser.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const ownerUser = await prisma.user.create({
    data: {
      email: 'owner-test@example.com',
      password,
    },
  });

  const memberUser = await prisma.user.create({
      data: {
          email: 'member-test@example.com',
          password,
      },
  });

  // Create tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Test Tenant',
      slug: 'test-tenant',
      users: {
        create: [
          {
            userId: ownerUser.id,
            role: 'owner',
          },
          {
              userId: memberUser.id,
              role: 'member',
          }
        ],
      },
    },
  });

  // FIX: Create and return a second tenant for testing cross-tenant access.
  const otherTenant = await prisma.tenant.create({
    data: {
      name: 'Other Test Tenant',
      slug: 'other-test-tenant',
    },
  });

  return { ownerUser, memberUser, tenant, otherTenant };
};
