import { Metadata } from "next";

import { AuthGuard } from "@/components/auth/auth-guard";

export const metadata: Metadata = {
	title: "My Favorites",
	description: "View your saved favorite products.",
	keywords: ["favorites", "wishlist", "saved items"],
	robots: {
		index: false,
		follow: false,
	},
};

export default function FavoritesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <AuthGuard>{children}</AuthGuard>;
}
