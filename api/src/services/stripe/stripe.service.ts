import { Injectable, InternalServerErrorException } from "@nestjs/common";

import Stripe, { Checkout } from "stripe";

@Injectable()
export class StripeService {
	private stripe!: Stripe.Stripe;

	constructor() {
		if (process.env.STRIPE_SECRET_KEY) {
			this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
				apiVersion: "2026-05-27.dahlia",
			});
		}
	}

	public get client(): Stripe.Stripe {
		return this.stripe;
	}

	async createCheckoutSession({
		lineItems,
		customerEmail,
		orderId,
		userId,
	}: {
		lineItems: Checkout.SessionCreateParams.LineItem[];
		customerEmail: string;
		orderId: string;
		userId: string;
	}): Promise<Checkout.Session> {
		try {
			return await this.stripe.checkout.sessions.create({
				payment_method_types: ["card"],
				line_items: lineItems,
				mode: "payment",
				success_url: `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
				cancel_url: `${process.env.CLIENT_URL}/cart`,
				customer_email: customerEmail,
				metadata: {
					orderId,
					userId,
				},
			});
		} catch (error) {
			console.error("Error creating session:", error);
			throw new InternalServerErrorException(
				"Failed to create checkout session",
			);
		}
	}
}
