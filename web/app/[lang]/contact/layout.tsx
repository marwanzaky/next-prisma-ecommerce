import { Metadata } from "next";

import { Locale } from "@repo/types";

import config from "@/lib/config";
import {
	generateLocaleAlternates,
	generateOgMetadata,
	generateTwitterMetadata,
} from "@/lib/generate";
import { localizePath } from "@/lib/i18n";

const title = "Contact Us - Get in Touch";
const description = `Have questions or need support? Contact ${config.websiteName} customer service. We're here to help!`;

export async function generateMetadata({
	params,
}: {
	params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
	const { lang } = await params;

	return {
		title,
		description,
		keywords: ["contact", "support", "help", "customer service"],
		openGraph: generateOgMetadata({
			title,
			description,
			path: localizePath("/contact", lang),
			type: "website",
		}),
		twitter: generateTwitterMetadata({
			title,
			description,
		}),
		alternates: generateLocaleAlternates("/contact", lang),
	};
}

export default function ContactLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
