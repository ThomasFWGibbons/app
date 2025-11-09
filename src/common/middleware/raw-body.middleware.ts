// FILE: src/common/middleware/raw-body.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
// FIX: Use json from express instead of body-parser to avoid type conflicts.
import { json } from 'express';
// FIX: Import Buffer to fix type errors.
import { Buffer } from 'buffer';

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    json({
      verify: (req: any, res, buffer) => {
        if (Buffer.isBuffer(buffer)) {
          req.rawBody = Buffer.from(buffer);
        }
        return true;
      },
    })(req as any, res as any, next);
  }
}
