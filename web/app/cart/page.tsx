"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { useCart } from "@hooks/use-cart";

import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@shadcn/components/ui/empty";
import { TypographyH4 } from "@shadcn/components/ui/typography";
import { Button } from "@shadcn/components/ui/button";
import { Card, CardContent } from "@shadcn/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@shadcn/components/ui/radio-group";
import { Label } from "@shadcn/components/ui/label";
import { Separator } from "@shadcn/components/ui/separator";
import { Field, FieldGroup, FieldLabel } from "@shadcn/components/ui/field";

import { Table } from "@shared/components/ui/table";
import { Section } from "@shared/components/ui/section";

import { formatCurrency } from "@utils/format-price";

export default function Page() {
	const router = useRouter();

	const { items, columns, tableData } = useCart();

	return (
		<Section>
			<TypographyH4 className="text-center mb-2 lg:mb-4">
				Your Cart
			</TypographyH4>

			{items.length > 0 ? (
				<div className="flex gap-4 flex-col md:flex-row">
					<Table className="md:w-2/3" columns={columns} data={tableData} />

					<Card className="md:w-1/3 h-fit">
						<CardContent className="space-y-4">
							<PaymentMethodSelector />
							<OrderSummary />

							<Button className="w-full">Proceed to checkout</Button>
						</CardContent>
					</Card>
				</div>
			) : (
				<Empty className="border border-dashed">
					<EmptyHeader>
						<EmptyTitle>Nothing here... yet.</EmptyTitle>
						<EmptyDescription className="max-w-xs text-pretty">
							Add items to your cart to see them here when you&apos;re ready to
							check out.
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<Button variant="outline" onClick={() => router.push("/products")}>
							Continue shopping
						</Button>
					</EmptyContent>
				</Empty>
			)}
		</Section>
	);
}

function PaymentMethodSelector() {
	return (
		<FieldGroup>
			<Field>
				<FieldLabel>How you'll pay</FieldLabel>
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
	const { items, total, subtotal, discount, discountPercent } = useCart();

	return (
		<div className="space-y-2">
			<div className="flex justify-between">
				<span>Subtotal</span>
				<span>{subtotal}</span>
			</div>

			<div className="flex justify-between">
				<span>Discount ({discountPercent})</span>
				<span>-{discount}</span>
			</div>

			<div className="flex justify-between">
				<span>Shipping</span>
				<span>{formatCurrency(0)}</span>
			</div>

			<Separator />

			<div className="flex justify-between font-semibold">
				<span>
					Total ({items.length} item{items.length > 1 && "s"})
				</span>
				<span>{total}</span>
			</div>
		</div>
	);
}
