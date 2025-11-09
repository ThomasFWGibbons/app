// FILE: src/common/db/withTenant.ts
import { PrismaClient } from '@prisma/client';

/**
 * Runs the provided operation inside a single DB connection/transaction and
 * sets the Postgres GUC `app.current_tenant` so Row Level Security applies.
 * IMPORTANT: Always execute tenant-scoped reads/writes through this helper.
 */
export async function withTenant<T>(
  prisma: PrismaClient,
  tenantId: string | undefined,
  fn: (tx: PrismaClient) => Promise<T>
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    if (tenantId) {
      // Safe, parameterized call. `true` sets it LOCAL to the transaction.
      await tx.$executeRaw`select set_config('app.current_tenant', ${tenantId}, true)`;
    }
    return fn(tx);
  });
}
