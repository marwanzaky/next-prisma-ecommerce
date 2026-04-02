import { Metadata } from "next";
import {
	generateOgMetadata,
	generateTwitterMetadata,
	getCanonicalUrl,
} from "@lib/generate";
import { website } from "@lib/config";

const title = "Browse Products";
const description = `Browse thousands of unique products from verified sellers worldwide. Find everything you need on ${website.name}.`;

export const metadata: Metadata = {
	title,
	description,
	keywords: ["products", "shop", "buy online", "ecommerce", "marketplace"],
	openGraph: generateOgMetadata({
		title,
		description,
		path: "/products",
		type: "website",
	}),
	twitter: generateTwitterMetadata({
		title,
		description,
	}),
	alternates: {
		canonical: getCanonicalUrl("/products"),
	},
};

export default function ProductsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
