import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Sign In",
	description:
		"Access your account to manage your orders, products, and profile.",
	robots: {
		index: false,
		follow: false,
	},
};

export default function SignInLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
