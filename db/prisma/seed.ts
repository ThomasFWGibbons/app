// FILE: db/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
// FIX: Import exit from process module to fix type error.
import { exit } from 'process';

// FIX: Declare __dirname to fix type error for CommonJS global.
declare const __dirname: string;

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  const saltRounds = 10;
  const password = await bcrypt.hash('password123', saltRounds);

  // Seed Users
  const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../seeds/users.json'), 'utf-8'));
  for (const u of usersData) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        ...u,
        password,
      },
    });
  }
  console.log('Users seeded.');
  
  const ownerUser = await prisma.user.findUnique({ where: { email: 'owner@example.com' } });
  if (!ownerUser) {
    throw new Error('Owner user not found. Seeding cannot continue.');
  }

  // Seed Tenants
  const tenantsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../seeds/tenants.json'), 'utf-8'));
  for (const t of tenantsData) {
    await prisma.tenant.upsert({
      where: { slug: t.slug },
      update: {},
      create: {
        ...t,
        users: {
          create: {
            userId: ownerUser.id,
            role: 'owner',
          },
        },
      },
    });
  }
  console.log('Tenants seeded.');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    // FIX: Use imported exit function to fix type error on process.exit.
    exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });