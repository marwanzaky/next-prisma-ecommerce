import { clientFetch } from "@/lib/api-client";

import { IProduct } from "@/types/product.type";

export const favoritesService = {
	getMe: () => clientFetch<IProduct[]>("/favorites"),
	post: (productId: string) =>
		clientFetch<IProduct>(`/favorites/${productId}`, { method: "POST" }),
	remove: (productId: string) =>
		clientFetch<null>(`/favorites/${productId}`, { method: "DELETE" }),
};
