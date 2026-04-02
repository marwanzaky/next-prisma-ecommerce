import { Metadata } from "next";

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
	return children;
}
