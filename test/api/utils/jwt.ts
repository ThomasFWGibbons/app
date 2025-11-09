// FILE: test/api/utils/jwt.ts
import * as jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'test-secret';

export function generateTestJwt(
  userId: string,
  email: string,
  tenantId: string,
  role: string
) {
  return jwt.sign(
    { sub: userId, email, tenantId, role },
    SECRET,
    { expiresIn: '15m' }
  );
}
