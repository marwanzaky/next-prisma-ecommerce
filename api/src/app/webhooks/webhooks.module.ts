import { Module } from "@nestjs/common";

import { StripeService } from "@/services/stripe/stripe.service";

import { PrismaService } from "@/prisma.service";

import { WebhooksController } from "./webhooks.controller";

@Module({
	controllers: [WebhooksController],
	providers: [PrismaService, StripeService],
})
export class WebhooksModule {}
