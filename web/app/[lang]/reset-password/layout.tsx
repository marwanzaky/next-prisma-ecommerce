import { Metadata } from "next";

import { Locale } from "@repo/types";

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
	const title = dict.resetPasswordPage.title;
	const description = dict.resetPasswordPage.description;

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
			path: localizePath("/reset-password", lang),
			type: "website",
		}),
		twitter: generateTwitterMetadata({
			title,
			description,
		}),
		alternates: generateLocaleAlternates("/reset-password", lang),
	};
}

export default function ResetPasswordLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
