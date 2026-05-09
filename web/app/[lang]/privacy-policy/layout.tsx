import { Metadata } from "next";

import { Locale } from "@repo/types";

import {
	generateLocaleAlternates,
	generateOgMetadata,
	generateTwitterMetadata,
} from "@/lib/generate";
import { localizePath } from "@/lib/i18n";

const title = "Privacy Policy";
const description = "Learn how we protect your privacy and use your data.";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
	const { lang } = await params;

	return {
		title,
		description,
		keywords: ["privacy", "privacy policy", "data protection"],
		robots: {
			index: true,
			follow: true,
		},
		openGraph: generateOgMetadata({
			title,
			description,
			path: localizePath("/privacy-policy", lang),
			type: "website",
		}),
		twitter: generateTwitterMetadata({
			title,
			description,
		}),
		alternates: generateLocaleAlternates("/privacy-policy", lang),
	};
}

export default function PrivacyPolicyLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
