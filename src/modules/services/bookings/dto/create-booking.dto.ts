// FILE: src/modules/bookings/dto/create-booking.dto.ts
import { IsUUID, IsISO8601, IsOptional, IsObject } from 'class-validator';
import Stripe from 'stripe';

export class CreateBookingDto {
  @IsUUID()
  tenant_id!: string;

  @IsUUID()
  service_id!: string;

  @IsUUID()
  @IsOptional()
  resource_id?: string;

  @IsUUID()
  @IsOptional()
  customer_id?: string;

  @IsUUID()
  @IsOptional()
  staff_id?: string;

  @IsISO8601()
  start_at!: string;

  @IsISO8601()
  end_at!: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}
