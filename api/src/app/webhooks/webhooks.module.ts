import { Module } from "@nestjs/common";

import { StripeService } from "@/services/stripe/stripe.service";

import { PrismaService } from "@/prisma.service";

import { WebhooksController } from "./webhooks.controller";
import { ResendService } from "@/services/resend/resend.service";

@Module({
	controllers: [WebhooksController],
	providers: [PrismaService, StripeService, ResendService],
})
export class WebhooksModule {}
