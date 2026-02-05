const withPWA = require("next-pwa")({
	dest: "public",
	register: true,
	skipWaiting: true,
	scope: "/app",
	sw: "sw.js",
	disable: process.env.NODE_ENV === "development",
});

module.exports = withPWA({
	turbopack: {},
	cacheComponents: true,
	reactStrictMode: true,
	images: {
		domains: [
			process.env.NEXT_PUBLIC_DOMAINS,
			"res.cloudinary.com",
			"mamolio.up.railway.app",
			"i.etsystatic.com",
			"mzkdoyjeakimztiocfrp.supabase.co",
		],
		formats: ["image/avif", "image/webp"],
	},
});
