import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/admin/", "/api/", "/private/"],
			},
		],
		sitemap: `https://${process.env.NEXT_PUBLIC_WEBSITE!}/sitemap.xml`,
		host: `https://${process.env.NEXT_PUBLIC_WEBSITE!}`,
	};
}
