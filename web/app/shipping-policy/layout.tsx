import { Metadata } from "next";
import {
	generateOgMetadata,
	generateTwitterMetadata,
	getCanonicalUrl,
} from "@lib/generate";
import { website } from "@lib/config";

const title = "Shipping Policy";
const description = `Find information about shipping times and costs on ${website.name}.`;

export const metadata: Metadata = {
	title,
	description,
	keywords: ["shipping", "delivery", "shipping policy"],
	robots: {
		index: true,
		follow: true,
	},
	openGraph: generateOgMetadata({
		title,
		description,
		path: "/shipping-policy",
		type: "website",
	}),
	twitter: generateTwitterMetadata({
		title,
		description,
	}),
	alternates: {
		canonical: getCanonicalUrl("/shipping-policy"),
	},
};

export default function ShippingPolicyLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
