import { Metadata } from "next";

import { AuthGuard } from "@/components/auth/auth-guard";

export const metadata: Metadata = {
	title: "My Shop",
	description:
		"Manage your products, track orders, and grow your shop from your dashboard.",
	robots: {
		index: false,
		follow: false,
	},
};

export default function SellLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <AuthGuard>{children}</AuthGuard>;
}
