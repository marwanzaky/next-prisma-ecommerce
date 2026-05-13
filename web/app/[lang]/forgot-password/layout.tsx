import { Metadata } from "next";

import { Locale } from "@repo/types";

import config from "@/lib/config";
import { getDictionary } from "@/lib/dictionaries";
import {
	generateLocaleAlternates,
	generateOgMetadata,
	generateTwitterMetadata,
} from "@/lib/generate";
import { localizePath } from "@/lib/i18n";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
	const { lang } = await params;
	const dict = await getDictionary(lang);
	const title = dict.forgotPasswordPage.title;
	const description = dict.forgotPasswordPage.description.replace(
		"{{name}}",
		config.websiteName,
	);

	return {
		title,
		description,
		robots: {
			index: false,
			follow: false,
		},
		openGraph: generateOgMetadata({
			title,
			description,
			path: localizePath("/forgot-password", lang),
			type: "website",
		}),
		twitter: generateTwitterMetadata({
			title,
			description,
		}),
		alternates: generateLocaleAlternates("/forgot-password", lang),
	};
}

export default function ForgotPasswordLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
