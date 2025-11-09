// FILE: tests/api/e2e/webhooks.e2e-spec.ts
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestApp } from '../utils/test-app';
import { makeStripeSignatureHeader, samplePaymentIntentSucceeded } from '../utils/stripe-sign';

describe('Stripe Webhook (e2e)', () => {
  let app: INestApplication;
  const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_secret';

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('accepts a valid payment_intent.succeeded event', async () => {
    const payload = JSON.stringify(samplePaymentIntentSucceeded());
    const sig = makeStripeSignatureHeader(payload, WEBHOOK_SECRET);

    await request(app.getHttpServer())
      .post('/api/v1/webhooks/stripe')
      .set('Content-Type', 'application/json')
      .set('Stripe-Signature', sig)
      .send(payload)
      .expect(200);
  });

  it('rejects invalid signature', async () => {
    const payload = JSON.stringify(samplePaymentIntentSucceeded({ id: 'pi_other' }));
    const badSig = makeStripeSignatureHeader(payload, 'wrong_secret');

    await request(app.getHttpServer())
      .post('/api/v1/webhooks/stripe')
      .set('Content-Type', 'application/json')
      .set('Stripe-Signature', badSig)
      .send(payload)
      .expect(400);
  });
});
