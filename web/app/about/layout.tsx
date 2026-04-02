import { Metadata } from "next";
import {
	generateOgMetadata,
	generateTwitterMetadata,
	getCanonicalUrl,
} from "@lib/generate";
import { website } from "@lib/config";

const { title, description, keywords } = {
	title: "About Us - Our Mission & Story",
	description: `Learn about ${website.name}, the global online marketplace empowering independent sellers worldwide.`,
	keywords: ["about", "company", "mission", "team", "story"],
};

export const metadata: Metadata = {
	title,
	description,
	keywords,
	openGraph: generateOgMetadata({
		title,
		description,
		path: "/about",
		type: "website",
	}),
	twitter: generateTwitterMetadata({ title, description }),
	alternates: {
		canonical: getCanonicalUrl("/about"),
	},
};

export default function AboutLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
