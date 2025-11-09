// FILE: src/modules/webhooks/stripe.controller.ts
import { Controller, Post, Req, Res, HttpCode } from '@nestjs/common';
import { Request, Response } from 'express';
import { StripeService } from './stripe.service';

@Controller('api/v1/webhooks')
export class StripeWebhookController {
  constructor(private readonly stripeService: StripeService) {}

  /**
   * This route relies on raw body being enabled in your bootstrap
   * for the path /api/v1/webhooks/stripe to verify Stripe signatures.
   */
  @Post('stripe')
  @HttpCode(200)
  async handleStripe(@Req() req: Request, @Res() res: Response) {
    try {
      // body-parser.raw middleware should have attached the raw buffer to req.body.
      // In tests we configured: app.use('/api/v1/webhooks/stripe', bodyParser.raw({ type: '*/*' }));
      const raw = (req as any).body; // Buffer
      const sig = req.header('Stripe-Signature') || undefined;

      const event = this.stripeService.verifyEvent(raw, sig);
      await this.stripeService.handleEvent(event);

      return res.status(200).send({ received: true });
    } catch (err: any) {
      return res.status(400).send({ error: err.message || 'Invalid signature' });
    }
  }
}
