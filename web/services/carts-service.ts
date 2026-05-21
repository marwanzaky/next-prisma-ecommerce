import { CartWithItems } from "@repo/database";

import { clientFetch } from "@/lib/api-client";

export const cartsService = {
	getMe: () => clientFetch<CartWithItems>("/carts"),
	createCartItem: (productId: string, quantity: number) =>
		clientFetch<CartWithItems>(`/carts/items/${productId}`, {
			method: "POST",
			body: JSON.stringify({
				quantity,
			}),
		}),
	updateCartItemQuantity: (productId: string, quantity: number) => {
		if (quantity <= 0) {
			quantity = 1;
		}

		return clientFetch<CartWithItems>(`/carts/items/${productId}/quantity`, {
			method: "PATCH",
			body: JSON.stringify({
				quantity,
			}),
		});
	},
	deleteCartItem: (productId: string) =>
		clientFetch<CartWithItems>(`/carts/items/${productId}`, {
			method: "DELETE",
		}),
};
