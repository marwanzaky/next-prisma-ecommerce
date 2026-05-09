import { MetadataRoute } from "next";

import { locales } from "@repo/types";

import { productsService } from "@/services/products-service";

import { localizeUrl } from "@/lib/i18n";
import { createProductSlug } from "@/lib/string-utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const getLocalizedEntries = ({
		pathname,
		lastModified,
		changeFrequency,
		priority,
	}: {
		pathname: string;
		lastModified: Date;
		changeFrequency: "daily" | "weekly" | "monthly";
		priority: number;
	}): MetadataRoute.Sitemap => {
		return locales.map((locale) => ({
			url: localizeUrl(pathname, locale),
			lastModified,
			changeFrequency,
			priority,
		}));
	};

	const staticPages: MetadataRoute.Sitemap = [
		...getLocalizedEntries({
			pathname: "/",
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1,
		}),
		...getLocalizedEntries({
			pathname: "/products",
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.95,
		}),
		...getLocalizedEntries({
			pathname: "/about",
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.8,
		}),
		...getLocalizedEntries({
			pathname: "/contact",
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.7,
		}),
	];

	const products = await productsService.getAllProducts();
	const productPages = products.flatMap((product) => {
		return getLocalizedEntries({
			pathname: `/products/${createProductSlug(product.name.en, product._id)}`,
			lastModified: new Date(product.updatedAt),
			changeFrequency: "weekly" as const,
			priority: 0.9,
		});
	});

	return [...staticPages, ...productPages];
}
