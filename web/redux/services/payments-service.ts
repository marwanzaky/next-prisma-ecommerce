import { clientFetch } from "@/lib/api-client";

export const paymentsService = {
	createCheckoutSession: (
		items: {
			id: string;
			quantity: number;
		}[],
	) =>
		clientFetch<{ url: string }>("/payments/create-checkout-session", {
			method: "POST",
			body: JSON.stringify({ items }),
		}),
};
