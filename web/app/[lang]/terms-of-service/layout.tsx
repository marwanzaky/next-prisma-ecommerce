import { Metadata } from "next";

import { Locale } from "@repo/types";

import config from "@/lib/config";
import {
	generateLocaleAlternates,
	generateOgMetadata,
	generateTwitterMetadata,
} from "@/lib/generate";
import { localizePath } from "@/lib/i18n";

const title = "Terms of Service";
const description = `Read ${config.websiteName}'s terms of service and policies.`;

export async function generateMetadata({
	params,
}: {
	params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
	const { lang } = await params;

	return {
		title,
		description,
		keywords: ["terms", "terms of service", "legal"],
		robots: {
			index: true,
			follow: true,
		},
		openGraph: generateOgMetadata({
			title,
			description,
			path: localizePath("/terms-of-service", lang),
			type: "website",
		}),
		twitter: generateTwitterMetadata({
			title,
			description,
		}),
		alternates: generateLocaleAlternates("/terms-of-service", lang),
	};
}

export default function TermsOfServiceLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
