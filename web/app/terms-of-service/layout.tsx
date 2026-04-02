import { Metadata } from "next";
import {
	generateOgMetadata,
	generateTwitterMetadata,
	getCanonicalUrl,
} from "@lib/generate";
import { website } from "@lib/config";

const title = "Terms of Service";
const description = `Read ${website.name}'s terms of service and policies.`;

export const metadata: Metadata = {
	title,
	description,
	keywords: ["terms", "terms of service", "legal"],
	robots: {
		index: true,
		follow: true,
	},
	openGraph: generateOgMetadata({
		title,
		description,
		path: "/terms-of-service",
		type: "website",
	}),
	twitter: generateTwitterMetadata({
		title,
		description,
	}),
	alternates: {
		canonical: getCanonicalUrl("/terms-of-service"),
	},
};

export default function TermsOfServiceLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
