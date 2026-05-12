import "./globals.css";

import { Metadata, Viewport } from "next";
import { Cairo, Poppins } from "next/font/google";
import { notFound } from "next/navigation";

import { Organization, WebPage, WebSite, WithContext } from "schema-dts";
import { Toaster } from "sonner";

import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Locale, locales } from "@repo/types";

import AppProviders from "@/redux/app-providers";

import AppStateInit from "@/components/layout/app-state-init";
import Banner from "@/components/layout/banner";
import Footer from "@/components/layout/footer";
import { I18nProvider } from "@/components/layout/i18n-provider";
import Navigation from "@/components/layout/navigation";

import { DirectionProvider } from "@/shadcn/components/ui/direction";
import { TooltipProvider } from "@/shadcn/components/ui/tooltip";

import config from "@/lib/config";
import { getDictionary } from "@/lib/dictionaries";
import { generateOgMetadata, generateTwitterMetadata } from "@/lib/generate";
import { getDirection, hasLocale, localizePath } from "@/lib/i18n";
import { localizeUrl } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	variable: "--font-poppins",
	display: "swap",
});

const cairo = Cairo({
	subsets: ["latin"],
	weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
	variable: "--font-cairo",
	display: "swap",
});

export const metadata: Metadata = {
	title: {
		default: config.title,
		template: `%s | ${config.websiteName}`,
	},
	description: config.description,
	keywords: config.keywords,
	authors: [
		{
			name: config.websiteName,
			url: config.clientUrl,
		},
	],
	openGraph: {
		...generateOgMetadata({
			title: config.title,
			description: config.description,
			path: "/",
			type: "website",
		}),
		url: undefined,
	},
	twitter: generateTwitterMetadata({
		title: config.title,
		description: config.description,
	}),
	icons: {
		icon: "/icon.svg",
	},
	manifest: "/manifest.webmanifest",
	robots: {
		index: true,
		follow: true,
	},

	creator: config.websiteName,
	publisher: config.websiteName,

	appleWebApp: {
		capable: true,
		statusBarStyle: "black-translucent",
		title: config.websiteName,
	},

	metadataBase: new URL(config.clientUrl),
};

export const viewport: Viewport = {
	themeColor: config.themeColor,
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
	viewportFit: "cover",
};

export async function generateStaticParams(): Promise<{ lang: Locale }[]> {
	return locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ lang: string }>;
}>) {
	const { lang } = await params;

	if (!hasLocale(lang)) {
		notFound();
	}

	const locale = lang as Locale;
	const dictionary = await getDictionary(locale);
	const direction = getDirection(locale);

	const homepageSchema = generateHomepageSchema(locale);

	return (
		<html
			lang={locale}
			dir={direction}
			className={cn(
				poppins.variable,
				cairo.variable,
				locale === "ar" ? cairo.variable : poppins.variable,
				locale === "ar" ? "font-cairo" : "font-poppins",
			)}
		>
			<head>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(homepageSchema),
					}}
				/>
			</head>
			<body className={cn("min-h-screen bg-background")}>
				<AppProviders>
					<DirectionProvider dir={direction}>
						<I18nProvider dictionary={dictionary} locale={locale}>
							<AppStateInit />
							<Analytics />
							<SpeedInsights />
							<Toaster />
							{/* <Chatbot /> */}

							<Banner />

							<Navigation />

							{/* Page */}
							<TooltipProvider>
								<main>{children}</main>
							</TooltipProvider>

							<Footer locale={locale} />
						</I18nProvider>
					</DirectionProvider>
				</AppProviders>
			</body>
			<GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!} />
		</html>
	);
}

export function generateHomepageSchema(locale: Locale) {
	const webpage: WithContext<WebPage> = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: config.websiteName,
		description: config.description,
		url: localizeUrl("/", locale),
		image: config.openGraphImage,
	};

	return {
		"@context": "https://schema.org",
		"@graph": [
			generateOrganizationSchema(locale),
			generateEcommerceSchema(locale),
			webpage,
		],
	};
}

export function generateOrganizationSchema(
	locale: Locale,
): WithContext<Organization> {
	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: config.websiteName,
		url: localizePath("/", locale),
		logo: config.logo,
		description: config.description,
		email: config.email,
		telephone: config.phone,
		sameAs: [
			config.social.twitter,
			config.social.instagram,
			config.social.youtube,
		].filter(Boolean),
		contactPoint: {
			"@type": "ContactPoint",
			contactType: "Customer Service",
			email: config.email,
			telephone: config.phone,
		},
	};
}

export function generateEcommerceSchema(locale: Locale): WithContext<WebSite> {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: config.websiteName,
		url: localizeUrl("/", locale),
		description: config.description,
		image: config.openGraphImage,
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: localizeUrl(
					"/products?search={search_term_string}",
					locale,
				),
			},
			query: "required name=search_term_string",
		},
		publisher: generateOrganizationSchema(locale),
	};
}
