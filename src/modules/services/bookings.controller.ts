// FILE: src/modules/bookings/bookings.controller.ts
import { Body, Controller, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { StripeService } from '../webhooks/stripe.service';

@Controller('api/v1')
export class BookingsController {
  constructor(
    private readonly bookings: BookingsService,
    private readonly stripe: StripeService,
  ) {}

  @Get('bookings')
  async list(@Req req: Request, @Query('tenant_id') tenant_id?: string, @Query('from') from?: string, @Query('to') to?: string, @Query('status') status?: string) {
    const tenantId = tenant_id ?? (req as any).tenantId;
    return this.bookings.list(tenantId, { tenant_id, from, to, status });
  }

  @Post('bookings')
  async create(@Req req: Request, @Body() dto: CreateBookingDto) {
    const tenantId = dto.tenant_id || (req as any).tenantId;
    const created = await this.bookings.create(tenantId, dto);
    return {
      id: created.id,
      status: created.status,
      start_at: created.startAt.toISOString(),
      end_at: created.endAt.toISOString(),
    };
  }

  @Patch('bookings/:bookingId')
  async updateStatus(@Req req: Request, @Param('bookingId') bookingId: string, @Body() body: { status?: string; metadata?: Record<string, unknown> }) {
    const tenantId = (req as any).tenantId;
    if (body?.status) {
      const updated = await this.bookings.setStatus(tenantId, bookingId, body.status);
      return { id: updated.id, status: updated.status };
    }
    return { ok: true };
  }

  @Post('bookings/:bookingId/confirm')
  async confirm(@Req req: Request, @Param('bookingId') bookingId: string) {
    const tenantId = (req as any).tenantId;
    const booking = await this.bookings.getById(tenantId, bookingId);
    if (!booking) {
      return { error: 'Not found' };
    }

    // Create a PaymentIntent via StripeService; amount can be derived from booking.totalCents or service price.
    const amount = booking.totalCents ?? 5000; // fallback for demo; wire to real pricing in your code
    const intent = await this.stripe.createPaymentIntent({
      amount_cents: amount,
      currency: 'GBP',
      metadata: { booking_id: booking.id, tenant_id: booking.tenantId },
    });

    return { client_secret: intent.client_secret, payment_intent_id: intent.id };
  }
}
