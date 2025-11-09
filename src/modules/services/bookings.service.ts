// FILE: src/modules/bookings/bookings.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaClient, Booking } from '@prisma/client';
import { withTenant } from '../../common/db/withTenant';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaClient) {}

  create(tenantId: string | undefined, dto: {
    tenant_id: string;
    service_id: string;
    resource_id?: string;
    customer_id?: string;
    staff_id?: string;
    start_at: string;
    end_at: string;
    metadata?: Record<string, unknown>;
  }) {
    const startAt = new Date(dto.start_at);
    const endAt = new Date(dto.end_at);

    return withTenant(this.prisma, tenantId, (tx) =>
      tx.booking.create({
        data: {
          tenantId: dto.tenant_id,
          serviceId: dto.service_id,
          resourceId: dto.resource_id ?? null,
          customerId: dto.customer_id ?? null,
          staffId: dto.staff_id ?? null,
          startAt,
          endAt,
          status: 'pending',
          metadata: (dto.metadata ?? null) as any,
        },
      })
    );
  }

  list(tenantId: string | undefined, args: { tenant_id?: string; from?: string; to?: string; status?: string }) {
    const where: any = {};
    if (args.status) where.status = args.status;
    if (args.from || args.to) {
      where.startAt = {};
      if (args.from) where.startAt.gte = new Date(args.from);
      if (args.to) where.startAt.lte = new Date(args.to);
    }

    return withTenant(this.prisma, tenantId, (tx) =>
      tx.booking.findMany({
        where,
        orderBy: { startAt: 'asc' },
      })
    );
  }

  getById(tenantId: string | undefined, bookingId: string) {
    return withTenant(this.prisma, tenantId, (tx) =>
      tx.booking.findUnique({ where: { id: bookingId } })
    );
  }

  setStatus(tenantId: string | undefined, bookingId: string, status: string) {
    return withTenant(this.prisma, tenantId, (tx) =>
      tx.booking.update({ where: { id: bookingId }, data: { status } })
    );
  }
}
