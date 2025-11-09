// FILE: src/modules/webhooks/stripe.service.ts
import Stripe from 'stripe';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    const key = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';
    this.stripe = new Stripe(key, { apiVersion: '2024-06-20' as any });
  }

  /**
   * Create a PaymentIntent for a booking confirmation.
   */
  async createPaymentIntent(args: { amount_cents: number; currency: string; metadata?: Record<string, string | number> }) {
    const intent = await this.stripe.paymentIntents.create({
      amount: args.amount_cents,
      currency: args.currency.toLowerCase(),
      metadata: Object.fromEntries(Object.entries(args.metadata ?? {}).map(([k, v]) => [k, String(v)])),
    });
    return intent;
  }

  /**
   * Verify Stripe signature and return the constructed Event.
   * @param payload raw body (exact bytes as Stripe sent)
   * @param signature header 'Stripe-Signature'
   */
  verifyEvent(payload: Buffer | string, signature: string | undefined) {
    const whSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_secret';
    if (!signature) {
      throw new Error('Missing Stripe-Signature');
    }
    // Stripe SDK expects the exact raw body string
    const bodyString = Buffer.isBuffer(payload) ? payload.toString('utf8') : payload;
    return this.stripe.webhooks.constructEvent(bodyString, signature, whSecret);
  }

  /**
   * Handle a subset of webhook events; extend as needed.
   */
  async handleEvent(event: Stripe.Event) {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        // TODO: map to your Payment/Booking state
        break;
      }
      case 'charge.refunded': {
        // TODO
        break;
      }
      default:
        break;
    }
  }
}
