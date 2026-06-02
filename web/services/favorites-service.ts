import {
	ProductTranslatedText,
	ProductWithVariantsReviewsUserTranslatedText,
} from "@repo/database";

import { clientFetch } from "@/lib/api-client";

export const favoritesService = {
	getMe: () =>
		clientFetch<ProductWithVariantsReviewsUserTranslatedText[]>("/favorites"),
	post: (productId: string) =>
		clientFetch<ProductWithVariantsReviewsUserTranslatedText>(
			`/favorites/${productId}`,
			{
				method: "POST",
			},
		),
	remove: (productId: string) =>
		clientFetch<null>(`/favorites/${productId}`, { method: "DELETE" }),
};
