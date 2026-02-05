import "./globals.css";

import { Poppins } from "next/font/google";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import Footer from "@components/footer";
import Navigation from "@components/navigation";
import AppStateInit from "@components/appStateInit";

import { Container } from "_shared/ui/container";
import { Toaster } from "_shared/shadcn/toaster";

import AppProviders from "@redux/appProviders";

import { cn } from "@lib/utils";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	variable: "--font-poppins",
	display: "swap",
});

export const metadata = {
	title: "Mamolio",
	description: "eCommerce",
	manifest: "/manifest.json",
	keywords: ["ecommerce", "technology", "web application"],
	viewport:
		"minimum-scale=1, initial-scale=1, width=device-width, shrink-to-     fit=no, viewport-fit=cover",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={cn("min-h-screen bg-background")}>
				<AppProviders>
					<AppStateInit />
					<Analytics />
					<SpeedInsights />
					<Toaster />
					{/* <Chatbot /> */}

					{/* Banner */}
					<div className="h-[2.625rem] flex justify-center items-center text-center text-white bg-custom-primary-foreground leading-none">
						Free shipping on orders over $50
					</div>

					{/* Navigation */}
					<div className="border-b-2">
						<Container>
							<Navigation />
						</Container>
					</div>

					{/* Page */}
					<Container>{children}</Container>

					{/* Footer */}
					<Footer />
				</AppProviders>
			</body>
		</html>
	);
}
