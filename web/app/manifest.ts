import { website } from "@lib/config";
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: website.name,
		short_name: website.name.toLowerCase(),
		description: website.description,
		start_url: `${website.baseUrl}/`,
		scope: `${website.baseUrl}/`,
		display: "standalone",
		theme_color: website.themeColor,
		background_color: website.backgroundColor,
		lang: "en-US",
		orientation: "any",
		dir: "auto",
		icons: [
			{
				src: "/icon.svg",
				sizes: "any",
				type: "image/svg+xml",
			},
		],
	};
}
