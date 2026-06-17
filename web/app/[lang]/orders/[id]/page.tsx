"use client";

import { ChevronLeft, Package } from "lucide-react";

import { useQuery } from "@tanstack/react-query";

import { ordersService } from "@/services/orders-service";

import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { useI18n } from "@/components/layout/i18n-provider";

import { Heading, TypographyMuted } from "@/shadcn/components/ui/typography";
import { Card, CardContent } from "@/shadcn/components/ui/card";
import { Separator } from "@/shadcn/components/ui/separator";
import { formatDate, formatPrice } from "@repo/types";
import { useParams } from "next/navigation";
import Link from "next/link";

import { localizePath } from "@/lib/i18n";
import { Button } from "@/shadcn/components/ui/button";

export default function OrdersPage() {
	const { t, locale } = useI18n();
	const params = useParams<{ id: string }>();

	const { data, isLoading } = useQuery({
		queryKey: ["orders/my-order/" + params.id],
		queryFn: () => ordersService.myOrder(params.id),
		staleTime: 0,
	});

	if (isLoading) {
		return <div className="p-8 text-center">Loading your orders...</div>;
	}

	if (!data) {
		return <div>This order does not exist</div>;
	}

	return (
		<Container>
			<Section className="max-w-4xl mx-auto space-y-2 lg:space-y-4">
				<div className="flex justify-center items-center gap-2">
					<Link href={localizePath("orders", locale)}>
						<Button variant="ghost">
							<ChevronLeft className="text-muted-foreground"></ChevronLeft>
						</Button>
					</Link>
					<Heading as="h4">Order</Heading>
					<TypographyMuted className="text-sm">
						(#{data.stripeSessionId?.slice(0, 20)})
					</TypographyMuted>
				</div>

				<TypographyMuted className="text-sm">
					Placed on {formatDate(data.createdAt)}
				</TypographyMuted>

				<Card>
					<CardContent className="divide-y divide-neutral-100">
						{data.items.map((item) => (
							<div
								key={item.id}
								className="py-4 flex items-start justify-between text-sm last:pb-0 first:pt-0"
							>
								<div className="flex gap-3">
									<div className="p-2 bg-neutral-100 rounded-md w-14 h-14 flex justify-center items-center">
										<Package className="h-5 w-5 text-neutral-500" />
									</div>

									<div>
										<h3 className="font-semibold text-neutral-900">
											{item.name}
										</h3>
										<p className="text-xs text-neutral-500 mt-0.5">
											Variant: {item.variantTitle}
										</p>
										<p className="text-xs text-neutral-400 mt-0.5">
											Qty: {item.quantity}
										</p>
									</div>
								</div>

								<p className="font-medium text-neutral-900">
									${((item.price * item.quantity) / 100).toFixed(2)}
								</p>
							</div>
						))}
					</CardContent>
				</Card>

				<Card>
					<CardContent className="space-y-2">
						<div className="flex justify-between items-center">
							<span className="text-neutral-500">Subtotal</span>
							<span className="text-neutral-900">
								{formatPrice(data.subtotalAmount / 100, locale)}
							</span>
						</div>

						<div className="flex justify-between items-center">
							<span className="text-neutral-500">Shipping</span>
							<span className="text-neutral-900">$0.00</span>
						</div>

						<div className="flex justify-between items-center">
							<span className="text-neutral-500">Tax</span>
							<span className="text-neutral-900">$0.00</span>
						</div>

						<Separator />

						<div className="flex justify-between items-center font-semibold text-base">
							<span>Total</span>
							<span>{formatPrice(data.totalAmount / 100, locale)}</span>
						</div>
					</CardContent>
				</Card>
			</Section>
		</Container>
	);
}
