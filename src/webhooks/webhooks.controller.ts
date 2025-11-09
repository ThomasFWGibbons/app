// FILE: src/webhooks/webhooks.controller.ts
import { Controller, Post, Headers, Req, RawBodyRequest } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { Public } from '../common/decorators/public.decorator';
import { ApiExcludeController } from '@nestjs/swagger';
import { Request } from 'express';

@ApiExcludeController()
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Public()
  @Post('stripe')
  handleStripeWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    // The raw body is needed to verify the signature
    return this.webhooksService.handleStripeEvent(req.rawBody, signature);
  }
}