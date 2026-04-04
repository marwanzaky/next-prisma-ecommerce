import "./globals.css";

import { Toaster } from "sonner";

import { generateOgMetadata, generateTwitterMetadata } from "@lib/generate";
import { cn } from "@lib/utils";

import { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import Footer from "@components/footer";
import Navigation from "@components/navigation";
import AppStateInit from "@components/app-state-init";

import { Container } from "@shared/components/ui/container";
import { TooltipProvider } from "@shadcn/components/ui/tooltip";

import AppProviders from "@redux/app-providers";
import { website } from "@lib/config";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	variable: "--font-poppins",
	display: "swap",
});

export const metadata: Metadata = {
	title: {
		default: website.title,
		template: `%s | ${website.name}`,
	},
	description: website.description,
	keywords: website.keywords,
	authors: [
		{
			name: website.name,
			url: website.baseUrl,
		},
	],
	openGraph: {
		...generateOgMetadata({
			title: website.title,
			description: website.description,
			path: "/",
			type: "website",
		}),
		url: undefined,
	},
	twitter: generateTwitterMetadata({
		title: website.title,
		description: website.description,
	}),
	icons: {
		icon: "/icon.svg",
	},
	manifest: "/manifest.json",
	robots: {
		index: true,
		follow: true,
	},

	creator: website.name,
	publisher: website.name,

	appleWebApp: {
		capable: true,
		statusBarStyle: "black-translucent",
		title: website.name,
	},

	metadataBase: new URL(website.baseUrl),
};

export const viewport: Viewport = {
	themeColor: website.themeColor,
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
	viewportFit: "cover",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={cn("font-poppins", poppins.variable)}>
			<body className={cn("min-h-screen bg-background")}>
				<AppProviders>
					<AppStateInit />
					<Analytics />
					<SpeedInsights />
					<Toaster />
					{/* <Chatbot /> */}

					{/* Banner */}
					<div className="h-10.5 flex justify-center items-center text-center text-white bg-primary leading-none">
						Free shipping on orders over $50
					</div>

					{/* Navigation */}
					<div className="border-b-2 sticky top-0 bg-white z-50">
						<Container>
							<Navigation />
						</Container>
					</div>

					{/* Page */}
					<Container>
						<TooltipProvider>
							<main>{children}</main>
						</TooltipProvider>
					</Container>

					{/* Footer */}
					<Footer />
				</AppProviders>
			</body>
			<GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!} />
		</html>
	);
}
