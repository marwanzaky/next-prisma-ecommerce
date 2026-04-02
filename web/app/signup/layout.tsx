import { website } from "@lib/config";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Create Account",
	description: `Join ${website.name} as a buyer or seller. Create your account today.`,
	robots: {
		index: false,
		follow: false,
	},
};

export default function SignUpLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
