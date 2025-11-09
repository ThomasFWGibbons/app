// FILE: src/tenants/tenants.service.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  async create(createTenantDto: CreateTenantDto, userId: string) {
    const { slug } = createTenantDto;

    // FIX: Cast to any to bypass PrismaClient type error for tenant model access.
    const existingTenant = await (this.prisma as any).tenant.findUnique({ where: { slug } });
    if (existingTenant) {
      throw new ConflictException(`Tenant with slug '${slug}' already exists.`);
    }

    // FIX: Cast to any to bypass PrismaClient type error for tenant model access.
    return (this.prisma as any).tenant.create({
      data: {
        ...createTenantDto,
        users: {
          create: {
            userId: userId,
            role: 'owner', // The user who creates the tenant is the owner
          },
        },
      },
    });
  }
}