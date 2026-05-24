import { CreateCheckoutSession } from "@repo/database";

import { clientFetch } from "@/lib/api-client";

export const paymentsService = {
	createCheckoutSession: (body: CreateCheckoutSession) =>
		clientFetch<{ url: string }>("/payments/create-checkout-session", {
			method: "POST",
			body: JSON.stringify(body),
		}),
};
