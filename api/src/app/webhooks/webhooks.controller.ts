import { Controller, Headers, Post, Req, Res } from "@nestjs/common";

import { Response } from "express";

import { StripeService } from "@/services/stripe/stripe.service";

import { PrismaService } from "@/prisma.service";
import { AuthenticatedRequest } from "@/types/request.type";

import { Public } from "../auth/auth.guard";

@Controller("webhooks")
@Public()
export class WebhooksController {
	constructor(
		private prisma: PrismaService,
		private stripe: StripeService,
	) {}

	@Post("stripe")
	async handleStripeWebhook(
		@Headers("stripe-signature") sig: string,
		@Req() req: AuthenticatedRequest,
		@Res() res: Response,
	) {
		const event = this.stripe.client.webhooks.constructEvent(
			req.rawBody,
			sig,
			process.env.STRIPE_WEBHOOK_SECRET!,
		);

		if (event.type === "checkout.session.completed") {
			const session = event.data.object;

			const orderId = session.metadata?.orderId;
			const userId = session.metadata?.userId;

			await this.prisma.$transaction([
				this.prisma.order.update({
					where: { id: orderId },
					data: {
						status: "PAID",
						shippingAddress: session.shipping_address_collection
							? JSON.stringify(session.shipping_address_collection)
							: undefined,
					},
				}),

				this.prisma.cartItem.deleteMany({
					where: {
						cart: { userId },
					},
				}),

				// Deduct Stock Inventory
			]);
		}

		return res.status(200).json({ received: true });
	}
}
