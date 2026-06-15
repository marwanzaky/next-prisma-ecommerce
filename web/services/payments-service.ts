import { clientFetch } from "@/lib/api-client";

export const paymentsService = {
	createCheckoutSession: () =>
		clientFetch<{ url: string }>("/payments/create-checkout-session", {
			method: "POST",
		}),
};
