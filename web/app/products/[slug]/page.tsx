import ProductDetails from "@components/product-details";
import { productsService } from "@redux/services/products-service";
import { createProductSlug } from "@utils/string-utils";
import { IProduct } from "@shared/interfaces";
import {
	generateOgMetadata,
	generateTwitterMetadata,
	getCanonicalUrl,
} from "@lib/generate";
import { Metadata } from "next";
import { generateProductStructuredData } from "@lib/structured-data";
import { website } from "@lib/config";

interface Props {
	params: Promise<{ slug: string }>;
}

export default async function Page({ params }: Props) {
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
				<ProductDetails product={product} />
			</main>
		</>
	);
}

async function getProduct(id: string): Promise<IProduct> {
	"use cache";
	return await productsService.getProduct(id);
}

export async function generateStaticParams() {
	const data = await productsService.getAllProducts();

	return data.map((product) => ({
		slug: createProductSlug(product.name, product._id),
	}));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	"use cache";

	const { slug } = await params;
	const id = slug.split("-").pop()!;

	const product = await productsService.getProduct(id);

	if (!product) {
		return {
			title: "Product Not Found",
			description: "This product does not exist",
			robots: "noindex, follow",
		};
	}

	return {
		title: `${product.name} - Best Price & Reviews | ${website.name}`,
		description: `${product.description.slice(0, 155)}...`,
		keywords: [
			product.name,
			...(product.tags || []),
			"shop",
			"buy online",
			website.name,
		].filter(Boolean),
		authors: [{ name: website.name }],
		openGraph: generateOgMetadata({
			title: product.name,
			description: product.description,
			path: `/products/${createProductSlug(product.name, product._id)}`,
			image: product.imgUrls[0],
			type: "website",
		}),
		twitter: generateTwitterMetadata({
			title: product.name,
			description: product.description,
			image: product.imgUrls[0],
		}),
		alternates: {
			canonical: getCanonicalUrl(
				`/products/${createProductSlug(product.name, product._id)}`,
			),
		},
	};
}
