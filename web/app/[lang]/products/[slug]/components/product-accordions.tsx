"use client";

import { useMemo } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ProductWithVariantsReviewsUser } from "@repo/database";

import { formatDate, TranslatedText } from "@repo/types";

import { useI18n } from "@/components/layout/i18n-provider";
import { renderLexicalJSONToHTML } from "@/components/ui/lexical/render-lexical-json-to-html";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/shadcn/components/ui/accordion";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/shadcn/components/ui/avatar";
import { TypographyMuted } from "@/shadcn/components/ui/typography";

import { localizePath } from "@/lib/i18n";
import { initials } from "@/lib/string-utils";

export default function ProductAccordions({
	product,
}: {
	product: ProductWithVariantsReviewsUser;
}) {
	const router = useRouter();
	const { locale, t } = useI18n();

	const descriptionHtml = useMemo(() => {
		const parsed = JSON.parse((product.description as TranslatedText)[locale]);
		return renderLexicalJSONToHTML(parsed.root.children);
	}, [product.description, locale]);

	return (
		<Accordion
			defaultValue="item-1"
			type="single"
			collapsible
			className="w-full"
		>
			<AccordionItem value="item-1">
				<AccordionTrigger>
					{t("productPage.accordion.description")}
				</AccordionTrigger>
				<AccordionContent asChild>
					<div
						className="prose prose-slate text-sm [&_img]:rounded-lg"
						dangerouslySetInnerHTML={{
							__html: descriptionHtml,
						}}
					/>
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="item-2">
				<AccordionTrigger>
					{t("productPage.accordion.shippingRefundPolicy")}
				</AccordionTrigger>
				<AccordionContent className="prose prose-slate text-sm">
					<h4>Refund Policy</h4>
					<p>
						We have a 30-day return policy, which means you have 30 days after
						receiving your item to request a return.
						<br />
						<br />
						To be eligible for a return, your item must be in the same condition
						that you received it, unworn or unused, with tags, and in its
						original packaging. You&apos;ll also need the receipt or proof of
						purchase.
						<br />
						<br />
						To start a return, you can contact us at{" "}
						{process.env.NEXT_PUBLIC_CONTACT}. If your return is accepted,
						we&apos;ll send you a return shipping label, as well as instructions
						on how and where to send your package. Items sent back to us without
						first requesting a return will not be accepted.
						<br />
						<br />
						You can always contact us for any return question at{" "}
						{process.env.NEXT_PUBLIC_CONTACT}.
					</p>

					<h4>Shipping Policy</h4>
					<p>
						All orders are processed within 1 to 3 business days (excluding
						weekends and holidays) after receiving your order confirmation
						email. You will receive another notification when your order has
						shipped.
					</p>

					<h4>International Shipping</h4>
					<p>
						We offer international shipping to the following countries: United
						States, United Kingdom, Australia, Canada, Germany, France, Spain,
						United Arab Emirates, Indonesia.
						<br />
						<br />
						Your order may be subject to import duties and taxes (including
						VAT), which are incurred once a shipment reaches your destination
						country.
					</p>
				</AccordionContent>
			</AccordionItem>

			<AccordionItem value="item-3">
				<AccordionTrigger>
					{t("productPage.accordion.sellerInformation")}
				</AccordionTrigger>
				<AccordionContent>
					<div className="flex items-center gap-2">
						<Avatar className="h-10 w-10">
							<AvatarImage
								role="button"
								src={product.user.avatarUrl || undefined}
								className="cursor-pointer"
								alt={t("photoOf").replace("{{name}}", product.user.name)}
								onClick={() =>
									router.push(localizePath(`/user/${product.user.id}`, locale))
								}
								loading="lazy"
							/>
							<AvatarFallback>{initials(product.user.name)}</AvatarFallback>
						</Avatar>

						<div>
							<Link
								href={localizePath(`/user/${product.userId}`, locale)}
								className="no-underline! hover:underline!"
							>
								{product.user.name}
							</Link>
							<TypographyMuted>
								{t("productPage.accordion.sellingSince")}{" "}
								{formatDate(product.user.createdAt || product.user.updatedAt)}
							</TypographyMuted>
						</div>
					</div>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
