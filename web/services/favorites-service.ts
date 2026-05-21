import { ProductTranslatedText } from "@repo/database";

import { clientFetch } from "@/lib/api-client";

export const favoritesService = {
	getMe: () => clientFetch<ProductTranslatedText[]>("/favorites"),
	post: (productId: string) =>
		clientFetch<ProductTranslatedText>(`/favorites/${productId}`, {
			method: "POST",
		}),
	remove: (productId: string) =>
		clientFetch<null>(`/favorites/${productId}`, { method: "DELETE" }),
};
