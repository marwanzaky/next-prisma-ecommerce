import { Module } from "@nestjs/common";

import { ResendService } from "@/services/resend/resend.service";
import { StripeService } from "@/services/stripe/stripe.service";

import { PrismaService } from "@/prisma.service";

import { WebhooksController } from "./webhooks.controller";

@Module({
	controllers: [WebhooksController],
	providers: [PrismaService, StripeService, ResendService],
})
export class WebhooksModule {}
