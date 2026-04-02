import { Metadata } from "next";
import {
	generateOgMetadata,
	generateTwitterMetadata,
	getCanonicalUrl,
} from "@lib/generate";

const title = "Refund Policy";
const description = "Learn about we refund and return policies.";

export const metadata: Metadata = {
	title,
	description,
	keywords: ["refund", "return", "refund policy"],
	robots: {
		index: true,
		follow: true,
	},
	openGraph: generateOgMetadata({
		title,
		description,
		path: "/refund-policy",
		type: "website",
	}),
	twitter: generateTwitterMetadata({
		title,
		description,
	}),
	alternates: {
		canonical: getCanonicalUrl("/refund-policy"),
	},
};

export default function RefundPolicyLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
