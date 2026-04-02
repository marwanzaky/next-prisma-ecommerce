import { Metadata } from "next";
import {
	generateOgMetadata,
	generateTwitterMetadata,
	getCanonicalUrl,
} from "@lib/generate";
import { website } from "@lib/config";

const title = "Contact Us - Get in Touch";
const description = `Have questions or need support? Contact ${website.name} customer service. We're here to help!`;

export const metadata: Metadata = {
	title,
	description,
	keywords: ["contact", "support", "help", "customer service"],
	openGraph: generateOgMetadata({
		title,
		description,
		path: "/contact",
		type: "website",
	}),
	twitter: generateTwitterMetadata({
		title,
		description,
	}),
	alternates: {
		canonical: getCanonicalUrl("/contact"),
	},
};

export default function ContactLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
