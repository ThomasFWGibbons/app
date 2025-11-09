// FILE: test/api/e2e/webhooks.e2e-spec.ts
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestApp } from '../utils/test-app';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { describe, beforeAll, afterAll, it, expect } from '@jest/globals';

describe('WebhooksController (e2e)', () => {
  let app: INestApplication;
  let stripe: Stripe;
  let webhookSecret: string;

  beforeAll(async () => {
    app = await createTestApp();
    const configService = app.get(ConfigService);
    const stripeKey = configService.get<string>('STRIPE_API_KEY');
    webhookSecret = configService.get<string>('STRIPE_WEBHOOK_SECRET');

    if (!stripeKey || !webhookSecret) {
      throw new Error('Stripe API Key or Webhook Secret not configured for e2e tests.');
    }

    stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' as any });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/webhooks/stripe (POST)', () => {
    // A mock Stripe event payload
    const eventPayload: Stripe.Event = {
      id: 'evt_test_webhook',
      object: 'event',
      type: 'payment_intent.succeeded',
      api_version: '2024-06-20',
      data: {
        object: {
          id: 'pi_test_12345',
          object: 'payment_intent',
          amount: 2000,
          currency: 'usd',
          status: 'succeeded',
        } as Stripe.PaymentIntent,
      },
      created: Math.floor(Date.now() / 1000),
      livemode: false,
      pending_webhooks: 1,
      request: {
        id: 'req_test_123',
        idempotency_key: 'idempotency_key_123',
      },
    };

    it('should accept and process a valid Stripe webhook event', () => {
      const payloadString = JSON.stringify(eventPayload, null, 2);
      // Generate a valid signature for the payload
      const signature = stripe.webhooks.generateTestHeaderString({
        payload: payloadString,
        secret: webhookSecret,
      });

      return request(app.getHttpServer())
        .post('/api/v1/webhooks/stripe')
        .set('stripe-signature', signature)
        .type('application/json')
        .send(payloadString)
        .expect(201)
        .then((res) => {
          expect(res.body).toEqual({ received: true });
        });
    });

    it('should reject a request with an invalid signature', () => {
      const payloadString = JSON.stringify(eventPayload, null, 2);

      return request(app.getHttpServer())
        .post('/api/v1/webhooks/stripe')
        .set('stripe-signature', 'whsec_invalid_signature_string')
        .type('application/json')
        .send(payloadString)
        .expect(400) // Expecting Bad Request
        .then((res) => {
          expect(res.body.message).toContain('Webhook Error');
        });
    });
  });
});
