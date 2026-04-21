"use client";

import Image from "next/image";
import Link from "next/link";

import { useI18n } from "@/components/layout/i18n-provider";

import { Separator } from "@/shadcn/components/ui/separator";
import { Heading } from "@/shadcn/components/ui/typography";

import { Container } from "@/shared/components/ui/container";

import { localizePath } from "@/lib/i18n";

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
						<li>
							<Link
								className="text-white whitespace-nowrap hover:underline"
								href={localizePath("/about", locale)}
							>
								{t("footer.aboutUs")}
							</Link>
						</li>
						<li>
							<Link
								className="text-white whitespace-nowrap hover:underline"
								href={localizePath("/refund-policy", locale)}
							>
								{t("footer.refundPolicy")}
							</Link>
						</li>

						<li>
							<Link
								className="text-white whitespace-nowrap hover:underline"
								href={localizePath("/privacy-policy", locale)}
							>
								{t("footer.privacyPolicy")}
							</Link>
						</li>

						<li>
							<Link
								className="text-white whitespace-nowrap hover:underline"
								href={localizePath("/terms-of-service", locale)}
							>
								{t("footer.termsOfService")}
							</Link>
						</li>

						<li>
							<Link
								className="text-white whitespace-nowrap hover:underline"
								href={localizePath("/shipping-policy", locale)}
							>
								{t("footer.shippingPolicy")}
							</Link>
						</li>
					</ul>
				</div>

				<div className="full-bleed">
					<Separator className="bg-[#525f63]" />
				</div>

				<div className="space-y-4">
					<div className="flex justify-center gap-2 h-6">
						<Image
							src="/svgs/payments/visa.svg"
							alt="Visa"
							width={36}
							height={24}
							loading="lazy"
						/>
						<Image
							src="/svgs/payments/mastercard.svg"
							alt="Mastercard"
							width={36}
							height={24}
							loading="lazy"
						/>
						<Image
							src="/svgs/payments/american_express.svg"
							alt="American Express"
							width={36}
							height={24}
							loading="lazy"
						/>
						<Image
							src="/svgs/payments/discover.svg"
							alt="Discover"
							width={36}
							height={24}
							loading="lazy"
						/>
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
