"use cache";
import { cacheLife } from "next/cache";

import ProductPage from "./components/product-page";

import { productsService } from "@/redux/services/products-service";

import { createProductSlug } from "@/utils/string-utils";

import { IProduct } from "@/types/product.type";

import { Metadata } from "next";

import {
	generateOgMetadata,
	generateTwitterMetadata,
	generateLocaleAlternates,
} from "@/lib/generate";
import { generateProductStructuredData } from "@/lib/structured-data";
import { Locale, localizePath } from "@/lib/i18n";
import config from "@/lib/config";

interface Props {
	params: Promise<{ slug: string; lang: Locale }>;
}

export default async function Page({ params }: Props) {
	cacheLife("minutes");

	const { slug } = await params;
	const id = slug.split("-").pop()!;

	const product = await getProduct(id);

	const structuredData = generateProductStructuredData(product);

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(structuredData),
				}}
			/>

			<main>
				<ProductPage product={product} />
			</main>
		</>
	);
}

async function getProduct(id: string): Promise<IProduct> {
	return await productsService.getProduct(id);
}

export async function generateStaticParams() {
	const data = await productsService.getAllProducts();

	return data.map((product) => ({
		slug: createProductSlug(product.name, product._id),
	}));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug, lang } = await params;
	const id = slug.split("-").pop()!;

	const product = await productsService.getProduct(id);

	if (!product) {
		return {
			title: "Product Not Found",
			description: "This product does not exist",
			robots: "noindex, follow",
		};
	}

	const path = `/products/${createProductSlug(product.name, product._id)}`;

	return {
		title: `${product.name} - Best Price & Reviews | ${config.websiteName}`,
		description: `${product.description.slice(0, 155)}...`,
		keywords: [
			product.name,
			...(product.tags || []),
			"shop",
			"buy online",
			config.websiteName,
		].filter(Boolean),
		authors: [{ name: config.websiteName }],
		openGraph: generateOgMetadata({
			title: product.name,
			description: product.description,
			path: localizePath(path, lang),
			image: product.imgUrls[0],
			type: "website",
		}),
		twitter: generateTwitterMetadata({
			title: product.name,
			description: product.description,
			image: product.imgUrls[0],
		}),
		alternates: generateLocaleAlternates(path, lang),
	};
}
