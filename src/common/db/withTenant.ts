// FILE: src/common/db/withTenant.ts
import { PrismaClient } from '@prisma/client';

// Define a type for the transactional Prisma client that is passed to the callback.
// This prevents operations like `$connect` or another `$transaction` inside the transaction.
export type TransactionalPrismaClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

/**
 * Executes a database operation within a transaction that has a tenant-specific context.
 * It sets a session-local configuration variable 'app.current_tenant', which is then
 * used by PostgreSQL's Row-Level Security (RLS) policies to filter data.
 *
 * @param prisma The PrismaClient instance.
 * @param tenantId The ID of the tenant to set in the session context.
 * @param fn The async function to execute within the transaction. It receives a
 *           transactional Prisma client instance (`tx`) to perform database operations.
 * @returns The result of the executed function `fn`.
 */
export async function withTenant<T>(
  prisma: PrismaClient,
  tenantId: string | undefined,
  fn: (tx: TransactionalPrismaClient) => Promise<T>,
): Promise<T> {
  // Prisma's interactive transactions are tied to a single connection.
  return prisma.$transaction(async (tx) => {
    if (tenantId) {
      // Set the tenant context for the current transaction using a parameterized query.
      // The 'true' flag makes this setting local to the current transaction only,
      // so it's automatically cleared when the transaction ends.
      await tx.$executeRaw`SELECT set_config('app.current_tenant', ${tenantId}, true)`;
    }
    // Execute the user-provided function with the transactional client
    return fn(tx);
  });
}
