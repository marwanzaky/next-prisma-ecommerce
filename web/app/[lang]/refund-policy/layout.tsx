import { Metadata } from "next";

import { Locale } from "@repo/types";

import {
	generateLocaleAlternates,
	generateOgMetadata,
	generateTwitterMetadata,
} from "@/lib/generate";
import { localizePath } from "@/lib/i18n";

const title = "Refund Policy";
const description = "Learn about we refund and return policies.";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
	const { lang } = await params;

	return {
		title,
		description,
		keywords: ["refund", "return", "refund policy"],
		robots: {
			index: true,
			follow: true,
		},
		openGraph: generateOgMetadata({
			title,
			description,
			path: localizePath("/refund-policy", lang),
			type: "website",
		}),
		twitter: generateTwitterMetadata({
			title,
			description,
		}),
		alternates: generateLocaleAlternates("/refund-policy", lang),
	};
}

export default function RefundPolicyLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
