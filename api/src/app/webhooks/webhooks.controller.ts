import { Controller, Headers, Post, Req, Res } from "@nestjs/common";

import { Response } from "express";

import { StripeService } from "@/services/stripe/stripe.service";

import { PrismaService } from "@/prisma.service";
import { AuthenticatedRequest } from "@/types/request.type";

import { Public } from "../auth/auth.guard";
import { ResendService } from "@/services/resend/resend.service";
import { formatDate, formatPrice } from "@repo/types";

@Controller("webhooks")
@Public()
export class WebhooksController {
	constructor(
		private prisma: PrismaService,
		private stripe: StripeService,
		private resend: ResendService,
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

			const order = await this.prisma.order.findUnique({
				where: {
					id: orderId,
				},
				include: {
					items: {
						include: {
							variant: true,
						},
					},
				},
			});

			const user = await this.prisma.user.findUnique({
				where: {
					id: userId,
				},
			});

			if (order && user) {
				await this.resend.sendOrderConfirmation(user.email, {
					companyName: "Mamolio",
					customerName: user.name,
					items: order.items,
					orderDate: formatDate(order.createdAt),
					orderNumber: order.stripeSessionId?.substring(0, 20) ?? "",
					receiptUrl: `${process.env.CLIENT_URL}/orders`,
					shipping: formatPrice(0, "en"),
					subtotal: formatPrice(order.subtotalAmount / 100, "en"),
					total: formatPrice(order.totalAmount / 100, "en"),
				});
			}
		}

		return res.status(200).json({ received: true });
	}
}
