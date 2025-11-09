// FILE: src/common/middleware/rls.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * This middleware ONLY extracts tenantId from the authenticated user
 * and attaches it to the request for downstream services/interceptors.
 * DB set_config happens inside per-request transactions (see withTenant).
 */
@Injectable()
export class RlsMiddleware implements NestMiddleware {
  async use(req: Request, _res: Response, next: NextFunction) {
    const tenantId = (req as any).user?.tenantId as string | undefined;
    (req as any).tenantId = tenantId;
    next();
  }
}
