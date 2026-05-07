import { ProductEntity } from "@repo/types";

import { clientFetch } from "@/lib/api-client";

export const favoritesService = {
	getMe: () => clientFetch<ProductEntity[]>("/favorites"),
	post: (productId: string) =>
		clientFetch<ProductEntity>(`/favorites/${productId}`, { method: "POST" }),
	remove: (productId: string) =>
		clientFetch<null>(`/favorites/${productId}`, { method: "DELETE" }),
};
