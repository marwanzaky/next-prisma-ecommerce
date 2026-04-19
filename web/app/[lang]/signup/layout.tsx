import { Metadata } from "next";

import config from "@/lib/config";

export const metadata: Metadata = {
	title: "Create Account",
	description: `Join ${config.websiteName} as a buyer or seller. Create your account today.`,
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
