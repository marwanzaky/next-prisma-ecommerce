import { MetadataRoute } from "next";

import config from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				disallow: [
					"/*/account",
					"/*/signin",
					"/*/signup",
					"/*/cart",
					"/*/favorites",
					"/*/store",
					"/*/user",
					"/*/admin",
					"/*/forgot-password",
					"/*/reset-password",
					"/*/auth",
				],
				crawlDelay: 1,
			},
		],
		sitemap: [`${config.clientUrl}/sitemap.xml`],
		host: config.clientUrl,
	};
}
