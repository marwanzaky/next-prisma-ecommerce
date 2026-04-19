const clientUrl = process.env.NEXT_PUBLIC_CLIENT_URL!;
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL!;
const name = process.env.NEXT_PUBLIC_NAME!;
const email = process.env.NEXT_PUBLIC_CONTACT!;

const config = {
	/** Client url of your website e.g https://twitter.com */
	clientUrl,
	serverUrl,
	/** Name of your website e.g Twitter */
	websiteName: name,
	title: `${name} - Global Online Marketplace for Independent Sellers`,
	description: `Shop unique products from independent sellers worldwide. Create your own seller shop on ${name} - where anyone can sell.`,
	keywords: [
		"ecommerce",
		"marketplace",
		"online shopping",
		"seller shop",
		"independent sellers",
	],
	email,
	phone: "",
	social: {
		twitter: "https://twitter.com/mamolio_store",
		instagram: "https://instagram.com/mamolio_official",
		youtube: "https://youtube.com/@mamolio",
	},
	twitterHandle: "@mamolio_store",
	themeColor: "#009679",
	backgroundColor: "#fff",
	logo: `${clientUrl}/icon.svg`,
	openGraphImage: `${clientUrl}/og-image.png`,
};

export default config;
