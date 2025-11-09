// FILE: tests/api/utils/jwt.ts
import { JwtService } from '@nestjs/jwt';

/**
 * Generates a JWT for testing purposes.
 * It uses a hardcoded secret for simplicity and determinism in tests,
 * which should match the one used in the testing environment configuration.
 *
 * @param userId - The user's unique identifier (sub claim).
 * @param email - The user's email address.
 * @param tenantId - The tenant ID to be included in the token.
 * @param role - The user's role within the tenant.
 * @returns A signed JWT string.
 */
export const generateTestJwt = (
  userId: string,
  email: string,
  tenantId: string,
  role: string,
): string => {
  const jwtService = new JwtService({
    secret: process.env.JWT_SECRET || 'test-secret-key-do-not-use-in-prod',
    signOptions: { expiresIn: '15m' }, // Short-lived for tests
  });

  const payload = {
    sub: userId,
    email,
    tenantId,
    role,
  };

  return jwtService.sign(payload);
};
