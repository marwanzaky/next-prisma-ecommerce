import { Metadata } from "next";

import { Locale } from "@repo/types";

import config from "@/lib/config";
import {
	generateLocaleAlternates,
	generateOgMetadata,
	generateTwitterMetadata,
} from "@/lib/generate";
import { localizePath } from "@/lib/i18n";

const title = "Shipping Policy";
const description = `Find information about shipping times and costs on ${config.websiteName}.`;

export async function generateMetadata({
	params,
}: {
	params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
	const { lang } = await params;

	return {
		title,
		description,
		keywords: ["shipping", "delivery", "shipping policy"],
		robots: {
			index: true,
			follow: true,
		},
		openGraph: generateOgMetadata({
			title,
			description,
			path: localizePath("/shipping-policy", lang),
			type: "website",
		}),
		twitter: generateTwitterMetadata({
			title,
			description,
		}),
		alternates: generateLocaleAlternates("/shipping-policy", lang),
	};
}

export default function ShippingPolicyLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
