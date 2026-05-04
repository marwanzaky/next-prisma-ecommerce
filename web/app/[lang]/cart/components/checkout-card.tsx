"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { useI18n } from "@/components/layout/i18n-provider";

import { Button } from "@/shadcn/components/ui/button";
import { Card, CardContent } from "@/shadcn/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/shadcn/components/ui/field";
import { Label } from "@/shadcn/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shadcn/components/ui/radio-group";
import { Separator } from "@/shadcn/components/ui/separator";

import { localizePath } from "@/lib/i18n";
import { formatPrice } from "@/lib/string-utils";

import { useCartPage } from "../use-cart";

export default function CheckoutCard() {
	const { t, locale } = useI18n();
	const router = useRouter();

	return (
		<Card className="md:w-1/3 h-fit rounded-md">
			<CardContent className="space-y-4">
				<PaymentMethodSelector />
				<OrderSummary />

				<Button
					className="w-full"
					onClick={() => router.push(localizePath("/signin", locale))}
				>
					{t("cartPage.checkoutCard.proceedToCheckout")}
				</Button>
			</CardContent>
		</Card>
	);
}

function PaymentMethodSelector() {
	const { t } = useI18n();

	return (
		<FieldGroup>
			<Field>
				<FieldLabel>{t("cartPage.checkoutCard.howYouPay")}</FieldLabel>
				<RadioGroup defaultValue="card" className="space-y-2">
					<div className="flex items-center gap-3">
						<RadioGroupItem value="card" id="card" />
						<Label htmlFor="card" className="flex justify-center gap-2">
							<Image
								src="/svgs/payments/visa.svg"
								className="border rounded"
								alt="Visa"
								width={36}
								height={24}
								loading="lazy"
							/>
							<Image
								src="/svgs/payments/mastercard.svg"
								className="border rounded"
								alt="Mastercard"
								width={36}
								height={24}
								loading="lazy"
							/>
							<Image
								src="/svgs/payments/american_express.svg"
								className="border rounded"
								alt="American Express"
								width={36}
								height={24}
								loading="lazy"
							/>
							<Image
								src="/svgs/payments/discover.svg"
								className="border rounded"
								alt="Discover"
								width={36}
								height={24}
								loading="lazy"
							/>
						</Label>
					</div>
				</RadioGroup>
			</Field>
		</FieldGroup>
	);
}

function OrderSummary() {
	const { locale, t } = useI18n();
	const { items, total, subtotal, discount, discountPercent } = useCartPage();

	return (
		<div className="space-y-2">
			<div className="flex justify-between">
				<span>{t("cartPage.checkoutCard.subtotal")}</span>
				<span>{subtotal}</span>
			</div>

			<div className="flex justify-between">
				<span>
					{t("cartPage.checkoutCard.discountWithPercent").replace(
						"{{percent}}",
						discountPercent,
					)}
				</span>
				<span>-{discount}</span>
			</div>

			<div className="flex justify-between">
				<span>{t("cartPage.checkoutCard.shipping")}</span>
				<span>{formatPrice(0, locale)}</span>
			</div>

			<Separator />

			<div className="flex justify-between font-semibold">
				<span>
					{(items.length === 1
						? t("cartPage.checkoutCard.totalItem")
						: t("cartPage.checkoutCard.totalItems")
					).replace("{{count}}", String(items.length))}
				</span>
				<span>{total}</span>
			</div>
		</div>
	);
}
