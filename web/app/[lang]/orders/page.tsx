"use client";

import { CheckCircle2,Package, ShoppingBag } from "lucide-react";

import { useQuery } from "@tanstack/react-query";

import { ordersService } from "@/services/orders-service";

import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { useI18n } from "@/components/layout/i18n-provider";

import { Card, CardContent, CardHeader } from "@/shadcn/components/ui/card";
import { Heading, TypographyMuted } from "@/shadcn/components/ui/typography";

export default function OrdersPage() {
	const { t } = useI18n();
	const { data: orders, isLoading } = useQuery({
		queryKey: ["orders/my-orders"],
		queryFn: () => ordersService.myOrders(),
		staleTime: 0,
	});

	if (isLoading) {
		return <div className="p-8 text-center">Loading your orders...</div>;
	}

	if (!orders || orders.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[40vh] text-neutral-500">
				<ShoppingBag className="h-12 w-12 mb-2 stroke-1" />
				<p>You haven't placed any orders yet.</p>
			</div>
		);
	}

	return (
		<Container>
			<Section className="max-w-4xl mx-auto space-y-2 lg:space-y-4">
				<div className="flex justify-center items-center gap-2">
					<Heading as="h4">Your Order</Heading>
					<TypographyMuted className="text-sm">
						(
						{(orders.length === 1 ? t("item") : t("items")).replace(
							"{{count}}",
							String(orders.length),
						)}
						)
					</TypographyMuted>
				</div>

				<div className="space-y-6">
					{orders.map((order) => (
						<Card key={order.id}>
							<CardHeader className="border-b border-neutral-200 flex flex-wrap justify-between gap-4 text-sm text-neutral-600">
								<div>
									<p className="text-xs uppercase font-semibold text-neutral-400">
										Order Placed
									</p>
									<p>{new Date(order.createdAt).toLocaleDateString()}</p>
								</div>
								<div>
									<p className="text-xs uppercase font-semibold text-neutral-400">
										Total Price
									</p>
									<p className="font-medium text-neutral-900">
										${(order.totalAmount / 100).toFixed(2)}
									</p>
								</div>
								<div>
									<p className="text-xs uppercase font-semibold text-neutral-400">
										Status
									</p>
									<span className="inline-flex items-center gap-1 font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded text-xs border border-green-200">
										<CheckCircle2 className="h-3 w-3" /> {order.status}
									</span>
								</div>
							</CardHeader>

							<CardContent className="divide-y divide-neutral-100">
								{order.items.map((item) => (
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
					))}
				</div>
			</Section>
		</Container>
	);
}
