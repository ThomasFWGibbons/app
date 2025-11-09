// FILE: src/modules/services/services.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { withTenant } from '../../common/db/withTenant';
import { Request } from 'express';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaClient) {}

  list(req: Request, tenantId: string) {
    const tid = tenantId || (req as any).tenantId;
    return withTenant(this.prisma, tid, (tx) =>
      tx.service.findMany({ where: {}, orderBy: { name: 'asc' } })
    );
  }

  create(req: Request, tenantId: string, data: {
    name: string;
    type: string;
    duration_minutes?: number;
    price_cents?: number;
    capacity?: number;
    metadata?: Record<string, unknown>;
  }) {
    const tid = tenantId || (req as any).tenantId;
    return withTenant(this.prisma, tid, (tx) =>
      tx.service.create({
        data: {
          tenantId: tid!,
          name: data.name,
          type: data.type,
          durationMinutes: data.duration_minutes ?? null,
          priceCents: data.price_cents ?? null,
          capacity: data.capacity ?? 1,
          metadata: (data.metadata ?? null) as any,
        },
      })
    );
  }
}
