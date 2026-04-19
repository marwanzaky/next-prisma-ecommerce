import config from "@/lib/config";
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: ["/", "/products", "/about", "/contact"],
				disallow: [
					"/account/",
					"/signin/",
					"/signup/",

					"/cart/",
					"/favorites/",
					"/sell",
					"/user/",

					"/admin/",
				],
				crawlDelay: 1,
			},
			{
				userAgent: "AdsBot-Google",
				allow: "/",
				crawlDelay: 0.5,
			},
			{
				userAgent: "Googlebot",
				allow: "/",
				crawlDelay: 0.5,
			},
		],
		sitemap: [`${config.clientUrl}/sitemap.xml`],
		host: config.clientUrl,
	};
}
