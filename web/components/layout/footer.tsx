"use client";

import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/common/container";
import { useI18n } from "@/components/layout/i18n-provider";

import { Separator } from "@/shadcn/components/ui/separator";
import { Heading } from "@/shadcn/components/ui/typography";

import { localizePath } from "@/lib/i18n";

import { DictionaryKeys } from "@/types/i18n.type";

const quicklinks: { label: DictionaryKeys; href: string }[] = [
	{
		label: "footer.aboutUs",
		href: "/about",
	},
	{
		label: "footer.refundPolicy",
		href: "/refund-policy",
	},
	{
		label: "footer.privacyPolicy",
		href: "/privacy-policy",
	},
	{
		label: "footer.termsOfService",
		href: "/terms-of-service",
	},
	{
		label: "footer.shippingPolicy",
		href: "/shipping-policy",
	},
];

const payments: { src: string; alt: string }[] = [
	{
		src: "/svgs/payments/visa.svg",
		alt: "Visa",
	},
	{
		src: "/svgs/payments/mastercard.svg",
		alt: "Mastercard",
	},
	{
		src: "/svgs/payments/american_express.svg",
		alt: "American Express",
	},
	{
		src: "/svgs/payments/discover.svg",
		alt: "Discover",
	},
];

export default function Footer() {
	const { locale, t } = useI18n();

	return (
		<footer className="py-6 bg-custom-background pb-8">
			<Container className="space-y-6!">
				<div className="space-y-4">
					<Heading as="h3" variant="h4" className="text-white">
						{t("footer.quickLinks")}
					</Heading>

					<ul className="flex flex-col md:flex-row gap-y-4 gap-x-5 flex-wrap text-sm">
						{quicklinks.map((link, i) => (
							<li key={`quicklink-${i}`}>
								<Link
									className="text-white whitespace-nowrap hover:underline"
									href={localizePath(link.href, locale)}
								>
									{t(link.label)}
								</Link>
							</li>
						))}
					</ul>
				</div>

				<Separator className="bg-[#525f63]" />

				<div className="space-y-4">
					<div className="flex justify-center gap-2 h-6">
						{payments.map((payment, i) => (
							<Image
								key={`payment-${i}`}
								src={payment.src}
								alt={payment.alt}
								width={36}
								height={24}
								loading="lazy"
							/>
						))}
					</div>

					<div className="text-sm text-white text-center font-bold">
						{t("footer.copyright").replace(
							"{{name}}",
							process.env.NEXT_PUBLIC_NAME ?? "",
						)}
					</div>
				</div>
			</Container>
		</footer>
	);
}
