import type { MetadataRoute } from "next";

import config from "@/lib/config";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: config.websiteName,
		short_name: config.websiteName.toLowerCase(),
		description: config.description,
		start_url: "/",
		scope: "/",
		display: "standalone",
		theme_color: config.themeColor,
		background_color: config.backgroundColor,
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
