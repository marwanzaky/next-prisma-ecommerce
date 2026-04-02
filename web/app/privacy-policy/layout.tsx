import { Metadata } from "next";
import {
	generateOgMetadata,
	generateTwitterMetadata,
	getCanonicalUrl,
} from "@lib/generate";

const title = "Privacy Policy";
const description = "Learn how we protect your privacy and use your data.";

export const metadata: Metadata = {
	title,
	description,
	keywords: ["privacy", "privacy policy", "data protection"],
	robots: {
		index: true,
		follow: true,
	},
	openGraph: generateOgMetadata({
		title,
		description,
		path: "/privacy-policy",
		type: "website",
	}),
	twitter: generateTwitterMetadata({
		title,
		description,
	}),
	alternates: {
		canonical: getCanonicalUrl("/privacy-policy"),
	},
};

export default function PrivacyPolicyLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
