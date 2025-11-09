// FILE: src/services/services.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { withTenant } from '../common/db/withTenant';
import { Service } from '@prisma/client';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new service for a specific tenant.
   * Uses the `withTenant` helper to ensure the operation is run
   * within a transaction with the correct RLS context.
   */
  async create(tenantId: string, createServiceDto: CreateServiceDto): Promise<Service> {
    return withTenant(this.prisma, tenantId, async (tx) => {
      // The RLS policy on the 'services' table will enforce that
      // the `tenantId` of the new record matches the `app.current_tenant` setting.
      return tx.service.create({
        data: {
          ...createServiceDto,
          tenantId: tenantId, // It's good practice to set it explicitly here too.
        },
      });
    });
  }

  /**
   * Finds all services for a specific tenant.
   * Uses the `withTenant` helper to ensure the query is automatically
   * filtered by the RLS policy in the database.
   */
  async findAll(tenantId: string): Promise<Service[]> {
    return withTenant(this.prisma, tenantId, async (tx) => {
      // The RLS policy will automatically add a `WHERE tenant_id = current_setting('app.current_tenant')`
      // to this query at the database level.
      return tx.service.findMany();
    });
  }
}
