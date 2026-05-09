import { OpenGraph } from "next/dist/lib/metadata/types/opengraph-types";
import { Twitter } from "next/dist/lib/metadata/types/twitter-types";

import { Locale, locales } from "@repo/types";

import config from "./config";
import { localizePath } from "./i18n";

export function generateOgMetadata({
	title,
	description,
	path = "",
	type = "website",
	image,
}: {
	title: string;
	description: string;
	path: string;
	type: "website" | "article";
	image?: string;
}): OpenGraph {
	return {
		title,
		description,
		url: getCanonicalUrl(path),
		siteName: config.websiteName,
		images: [
			{
				url: image || config.openGraphImage,
				width: 1200,
				height: 630,
				alt: title,
			},
		],
		locale: "en_US",
		type,
	};
}

export function generateTwitterMetadata({
	title,
	description,
	image,
}: {
	title: string;
	description: string;
	image?: string;
}): Twitter {
	return {
		card: "summary_large_image",
		title,
		description,
		images: [image || config.openGraphImage],
		creator: config.twitterHandle,
		site: config.twitterHandle,
	};
}

export function getCanonicalUrl(path: string = ""): string {
	const cleanPath = path.startsWith("/") ? path : `/${path}`;
	return `${config.clientUrl}${cleanPath}`;
}

export function generateLocaleAlternates(path: string, locale: Locale) {
	return {
		canonical: getCanonicalUrl(localizePath(path, locale)),
		languages: Object.fromEntries(
			locales.map((lang) => [lang, getCanonicalUrl(localizePath(path, lang))]),
		) as Record<Locale, string>,
	};
}
