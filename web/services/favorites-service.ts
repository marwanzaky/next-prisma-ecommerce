import { ProductWithVariantsReviewsUser } from "@repo/database";

import { clientFetch } from "@/lib/api-client";

export const favoritesService = {
	getMe: () => clientFetch<ProductWithVariantsReviewsUser[]>("/favorites"),
	post: (productId: string) =>
		clientFetch<ProductWithVariantsReviewsUser>(`/favorites/${productId}`, {
			method: "POST",
		}),
	remove: (productId: string) =>
		clientFetch<null>(`/favorites/${productId}`, { method: "DELETE" }),
};
