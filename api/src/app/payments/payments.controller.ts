import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";

import Stripe from "stripe";

import { TranslatedText } from "@repo/types";

import { Public } from "@/app/auth/auth.guard";

import { PrismaService } from "@/prisma.service";

import { CreateCheckoutSessionDto } from "./dto/create-checkout-session.dto";

import { PaymentsService } from "./payments.service";

@Controller("payments")
export class PaymentsController {
	constructor(
		private readonly paymentsService: PaymentsService,
		private readonly prisma: PrismaService,
	) {}

	@Post("create-checkout-session")
	@Public()
	@ApiOperation({
		summary: "Create a checkout session",
	})
	async create(@Body() body: CreateCheckoutSessionDto) {
		const products = await this.prisma.product.findMany({
			where: {
				id: {
					in: body.items.map((item) => item.id),
				},
			},
		});

		const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = body.items
			.map((item) => {
				const matchProduct = products.find((product) => product.id === item.id);

				if (matchProduct) {
					return {
						price_data: {
							currency: "usd",
							product_data: { name: (matchProduct.name as TranslatedText).en },
							unit_amount: matchProduct.price,
						},
						quantity: item.quantity,
					};
				}

				return null;
			})
			.filter((item) => item !== null);

		const session = await this.paymentsService.createCheckoutSession(lineItems);

		return {
			url: session.url,
		};
	}
}
