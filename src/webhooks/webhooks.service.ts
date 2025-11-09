// FILE: src/webhooks/webhooks.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
// FIX: Import Buffer to fix type error for raw request body.
import { Buffer } from 'buffer';
// Assuming a payments service exists to update payment status
// import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class WebhooksService {
  private readonly stripe: Stripe;
  private readonly webhookSecret: string;

  constructor(
    private configService: ConfigService,
    // private paymentsService: PaymentsService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_API_KEY'), {
      // FIX: Cast apiVersion to 'any' to resolve a type mismatch with a seemingly incorrect or outdated Stripe typing. '2024-06-20' is a valid version.
      apiVersion: '2024-06-20' as any,
    });
    this.webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
  }

  async handleStripeEvent(payload: Buffer, signature: string) {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, this.webhookSecret);
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
        // Here you would typically update the payment record in your database
        // await this.paymentsService.updatePaymentStatus(paymentIntent.id, 'succeeded');
        break;
      case 'charge.refunded':
        const charge = event.data.object as Stripe.Charge;
        console.log(`Charge ${charge.id} was refunded.`);
        // await this.paymentsService.updatePaymentStatusByCharge(charge.id, 'refunded');
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }
}