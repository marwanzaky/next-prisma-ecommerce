import { Metadata } from "next";
import {
	generateOgMetadata,
	generateTwitterMetadata,
	getCanonicalUrl,
} from "@lib/generate";

const { title, description, keywords } = {
	title: "Shopping Cart",
	description:
		"Review items in your shopping cart. Proceed to checkout securely.",
	keywords: ["cart", "shopping cart", "checkout"],
};

export const metadata: Metadata = {
	title,
	description,
	keywords,
	robots: "noindex, follow",
	openGraph: generateOgMetadata({
		title,
		description,
		path: "/cart",
		type: "website",
	}),
	twitter: generateTwitterMetadata({
		title,
		description,
	}),
	alternates: {
		canonical: getCanonicalUrl("/cart"),
	},
};

export default function CartLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
