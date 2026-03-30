import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Mamolio",
		short_name: "mamolio",
		description:
			"Mamolio is an online marketplace where you can buy and sell products easily. Discover a wide range of items from trusted sellers, list your own products in minutes, and enjoy secure transactions. Shop, sell, and connect with a community of buyers and sellers in one convenient platform.",
		start_url: `https://${process.env.NEXT_PUBLIC_WEBSITE!}/`,
		scope: `https://${process.env.NEXT_PUBLIC_WEBSITE!}/`,
		display: "standalone",
		theme_color: "#009679",
		background_color: "#fff",
		lang: "en-US",
		orientation: "any",
		dir: "auto",
		icons: [
			{
				purpose: "maskable",
				sizes: "512x512",
				src: "icon512_maskable.png",
				type: "image/png",
			},
			{
				purpose: "any",
				sizes: "512x512",
				src: "icon512_rounded.png",
				type: "image/png",
			},
		],
	};
}
