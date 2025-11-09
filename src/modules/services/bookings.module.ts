// FILE: src/modules/bookings/bookings.module.ts
import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { PrismaClient } from '@prisma/client';
import { StripeService } from '../webhooks/stripe.service';

@Module({
  controllers: [BookingsController],
  providers: [BookingsService, PrismaClient, StripeService],
  exports: [BookingsService],
})
export class BookingsModule {}
