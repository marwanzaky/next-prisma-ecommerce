import { Metadata } from "next";

import { Locale } from "@repo/types";

import {
	generateLocaleAlternates,
	generateOgMetadata,
	generateTwitterMetadata,
} from "@/lib/generate";
import { localizePath } from "@/lib/i18n";

const { title, description, keywords } = {
	title: "Shopping Cart",
	description:
		"Review items in your shopping cart. Proceed to checkout securely.",
	keywords: ["cart", "shopping cart", "checkout"],
};

export async function generateMetadata({
	params,
}: {
	params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
	const { lang } = await params;

	return {
		title,
		description,
		keywords,
		robots: "noindex, follow",
		openGraph: generateOgMetadata({
			title,
			description,
			path: localizePath("/cart", lang),
			type: "website",
		}),
		twitter: generateTwitterMetadata({
			title,
			description,
		}),
		alternates: generateLocaleAlternates("/cart", lang),
	};
}

export default function CartLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
