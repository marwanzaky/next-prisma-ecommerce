import { Metadata } from "next";

import {
	generateOgMetadata,
	generateTwitterMetadata,
	generateLocaleAlternates,
} from "@/lib/generate";
import config from "@/lib/config";
import { Locale, localizePath } from "@/lib/i18n";

const { title, description, keywords } = {
	title: "About Us - Our Mission & Story",
	description: `Learn about ${config.websiteName}, the global online marketplace empowering independent sellers worldwide.`,
	keywords: ["about", "company", "mission", "team", "story"],
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
		openGraph: generateOgMetadata({
			title,
			description,
			path: localizePath("/about", lang),
			type: "website",
		}),
		twitter: generateTwitterMetadata({ title, description }),
		alternates: generateLocaleAlternates("/about", lang),
	};
}

export default function AboutLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
