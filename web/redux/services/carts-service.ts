import { clientFetch } from "@/lib/api-client";

import { ICart } from "@/types/cart.type";

export const cartsService = {
	getMe: () => clientFetch<ICart>("/carts"),
	postItem: (productId: string, quantity: number) =>
		clientFetch<ICart>(`/carts/items/${productId}`, {
			method: "POST",
			body: JSON.stringify({
				quantity,
			}),
		}),
	updateItemQuantity: (productId: string, quantity: number) => {
		if (quantity <= 0) {
			quantity = 1;
		}

		return clientFetch<ICart>(`/carts/items/${productId}/quantity`, {
			method: "PATCH",
			body: JSON.stringify({
				quantity,
			}),
		});
	},
	deleteItem: (productId: string) =>
		clientFetch<ICart>(`/carts/items/${productId}`, {
			method: "DELETE",
		}),
};
