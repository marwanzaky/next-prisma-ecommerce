import { Product, WithContext } from "schema-dts";

import { ProductWithReviewsAndUser } from "@repo/database";

import { Locale, TranslatedText } from "@repo/types";

import config from "./config";
import { localizeUrl } from "./i18n";
import { createProductSlug } from "./string-utils";

export function generateProductStructuredData(
	product: ProductWithReviewsAndUser,
	locale: Locale,
): WithContext<Product> {
	const productUrl = localizeUrl(
		`/products/${createProductSlug(product.name.en, product.id)}`,
		locale,
	);
	const offerId = `${productUrl}#offer`;

	return {
		"@context": "https://schema.org",
		"@type": "Product",
		"@id": productUrl,
		name: product.name[locale],
		description: product.description[locale],
		image: product.imgUrls,
		category: product.categoryId ?? undefined,
		offers: {
			"@type": "Offer",
			"@id": offerId,
			price: product.price,
			priceCurrency: "USD",
			availability:
				product.stock > 0
					? "https://schema.org/InStock"
					: "https://schema.org/OutOfStock",
			seller: {
				"@type": "Organization",
				name: product.user.name,
				url: config.clientUrl,
			},
			inventoryLevel: {
				"@type": "QuantitativeValue",
				value: product.stock,
			},
		},
		aggregateRating:
			product.reviews.length > 0
				? {
						"@type": "AggregateRating",
						ratingValue: product.avgRatings,
						reviewCount: product.reviews.length,
					}
				: undefined,
		review: product.reviews.map((review) => ({
			"@type": "Review",
			reviewRating: {
				"@type": "Rating",
				ratingValue: review.rating,
			},
			author: {
				"@type": "Person",
				name: review.user.name,
			},
			reviewBody: (review.description as TranslatedText)?.[locale],
			datePublished: review.createdAt as unknown as string,
		})),
	};
}
