import { CartWithItems } from "@repo/database";

import { clientFetch } from "@/lib/api-client";

export const cartsService = {
	getMe: () => clientFetch<CartWithItems>("/carts"),
	createCartItem: (productVariantId: string, quantity: number) =>
		clientFetch<CartWithItems>(`/carts/items/${productVariantId}`, {
			method: "POST",
			body: JSON.stringify({
				quantity,
			}),
		}),
	updateCartItemQuantity: (productVariantId: string, quantity: number) => {
		if (quantity <= 0) {
			quantity = 1;
		}

		return clientFetch<CartWithItems>(
			`/carts/items/${productVariantId}/quantity`,
			{
				method: "PATCH",
				body: JSON.stringify({
					quantity,
				}),
			},
		);
	},
	deleteCartItem: (productVariantId: string) =>
		clientFetch<CartWithItems>(`/carts/items/${productVariantId}`, {
			method: "DELETE",
		}),
};
