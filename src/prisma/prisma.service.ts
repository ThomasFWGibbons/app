// FILE: src/prisma/prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    // FIX: Cast to any to bypass PrismaClient type error for $connect.
    await (this as any).$connect();
  }
}