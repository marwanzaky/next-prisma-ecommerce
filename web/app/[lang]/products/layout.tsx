import { Metadata } from "next";
import {
	generateOgMetadata,
	generateTwitterMetadata,
	generateLocaleAlternates,
} from "@/lib/generate";
import { Locale, localizePath } from "@/lib/i18n";
import config from "@/lib/config";

const title = "Browse Products";
const description = `Browse thousands of unique products from verified sellers worldwide. Find everything you need on ${config.websiteName}.`;

export async function generateMetadata({
	params,
}: {
	params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
	const { lang } = await params;

	return {
		title,
		description,
		keywords: ["products", "shop", "buy online", "ecommerce", "marketplace"],
		openGraph: generateOgMetadata({
			title,
			description,
			path: localizePath("/products", lang),
			type: "website",
		}),
		twitter: generateTwitterMetadata({
			title,
			description,
		}),
		alternates: generateLocaleAlternates("/products", lang),
	};
}

export default function ProductsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
