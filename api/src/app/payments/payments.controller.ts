import { BadRequestException, Controller, Post, Req } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";

import { Checkout } from "stripe";

import { cartWithItems } from "@repo/database";
import { TranslatedText } from "@repo/types";

import { StripeService } from "@/services/stripe/stripe.service";

import { PrismaService } from "@/prisma.service";
import { AuthenticatedRequest } from "@/types/request.type";

@Controller("payments")
export class PaymentsController {
	constructor(
		private readonly stripeService: StripeService,
		private readonly prisma: PrismaService,
	) {}

	@Post("create-checkout-session")
	@ApiOperation({
		summary: "Create a checkout session",
	})
	async create(@Req() req: AuthenticatedRequest) {
		const cart = await this.prisma.cart.findUnique({
			where: { userId: req.user.id },
			...cartWithItems,
		});

		const user = await this.prisma.user.findUnique({
			where: {
				id: req.user.id,
			},
		});

		if (!user) {
			throw new BadRequestException("User not found.");
		}

		if (!cart || cart.items.length === 0) {
			throw new BadRequestException("Your cart is empty or invalid.");
		}

		let totalAmount = 0;

		const lineItems: Checkout.SessionCreateParams.LineItem[] = cart.items.map(
			(item) => {
				totalAmount += item.variant.price * item.quantity;
				return {
					price_data: {
						currency: "usd",
						product_data: {
							name: (item.variant.product.name as TranslatedText).en,
							description: item.variant.title,
							images: item.variant.imgUrls.length
								? [item.variant.imgUrls[0]]
								: [],
						},
						unit_amount: item.variant.price,
					},
					quantity: item.quantity,
				};
			},
		);

		const order = await this.prisma.order.create({
			data: {
				userId: req.user.id,
				totalAmount: totalAmount,
				subtotalAmount: totalAmount,
				status: "PENDING",
				items: {
					create: cart.items.map((item) => ({
						variantId: item.variantId,
						quantity: item.quantity,
						price: item.variant.price,
						name: (item.variant.product.name as TranslatedText)["en"],
						variantTitle: item.variant.title,
					})),
				},
			},
		});

		const session = await this.stripeService.createCheckoutSession({
			lineItems,
			customerEmail: user.email,
			orderId: order.id,
			userId: req.user.id,
		});

		await this.prisma.order.update({
			where: { id: order.id },
			data: { stripeSessionId: session.id },
		});

		return {
			url: session.url,
		};
	}
}
