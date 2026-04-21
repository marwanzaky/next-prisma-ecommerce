import { Metadata } from "next";

import { AuthGuard } from "@/components/auth/auth-guard";

export const metadata: Metadata = {
	title: "My Account",
	description: "Manage your account, orders, and preferences.",
	robots: {
		index: false,
		follow: false,
	},
};

export default function AccountLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <AuthGuard>{children}</AuthGuard>;
}
