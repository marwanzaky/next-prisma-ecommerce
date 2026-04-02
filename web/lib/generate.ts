import { OpenGraph } from "next/dist/lib/metadata/types/opengraph-types";
import { Twitter } from "next/dist/lib/metadata/types/twitter-types";
import { website } from "./config";

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
		siteName: website.name,
		images: [
			{
				url: image || website.openGraphImage,
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
		images: [image || website.openGraphImage],
		creator: website.twitterHandle,
		site: website.twitterHandle,
	};
}

export function getCanonicalUrl(path: string = ""): string {
	const cleanPath = path.startsWith("/") ? path : `/${path}`;
	return `${website.baseUrl}${cleanPath}`;
}
