// FILE: src/common/middleware/rls.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware that only extracts tenantId from the authenticated user and
 * attaches it to the request. We DO NOT touch the database here.
 * The DB `set_config('app.current_tenant', ...)` is applied inside per-request
 * transactions via the withTenant() helper.
 */
@Injectable()
export class RlsMiddleware implements NestMiddleware {
  async use(req: Request, _res: Response, next: NextFunction) {
    const tenantId = (req as any).user?.tenantId as string | undefined;
    (req as any).tenantId = tenantId;
    next();
  }
}

