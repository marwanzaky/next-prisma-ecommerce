import { IProduct } from "@shared/interfaces";

import { Product, WithContext } from "schema-dts";
import { website } from "./config";

export function generateProductStructuredData(
	product: IProduct,
): WithContext<Product> {
	const { baseUrl } = website;
	const productUrl = `${baseUrl}/products/${product._id}`;
	const offerId = `${productUrl}#offer`;

	return {
		"@context": "https://schema.org",
		"@type": "Product",
		"@id": productUrl,
		name: product.name,
		description: product.description,
		image: product.imgUrls,
		category: product.category ?? undefined,
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
				name: product.user?.name,
				url: baseUrl,
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
			reviewBody: review.description,
			datePublished: review.createdAt,
		})),
	};
}
