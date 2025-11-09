// FILE: tests/api/utils/stripe-sign.ts
import * as crypto from 'crypto';

/**
 * Builds a Stripe-like signature header for webhook tests.
 * Header format: t=<unix>,v1=<hex hmac sha256(secret, `${t}.${rawBody}`)>
 */
export function makeStripeSignatureHeader(rawBody: string, secret: string, timestamp?: number) {
  const t = timestamp ?? Math.floor(Date.now() / 1000);
  const signedPayload = `${t}.${rawBody}`;
  const v1 = crypto.createHmac('sha256', secret).update(signedPayload, 'utf8').digest('hex');
  return `t=${t},v1=${v1}`;
}

export const samplePaymentIntentSucceeded = (overrides: Partial<Record<string, any>> = {}) => ({
  id: 'evt_test_payment_intent_succeeded',
  type: 'payment_intent.succeeded',
  created: Math.floor(Date.now() / 1000),
  data: {
    object: {
      id: 'pi_test_123',
      amount: 5000,
      currency: 'usd',
      status: 'succeeded',
      ...overrides,
    },
  },
  livemode: false,
  object: 'event',
  pending_webhooks: 1,
  request: { id: 'req_test_123', idempotency_key: null },
});
