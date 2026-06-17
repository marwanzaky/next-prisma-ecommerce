"use client";

import { ShoppingBag } from "lucide-react";

import { useQuery } from "@tanstack/react-query";

import { ordersService } from "@/services/orders-service";

import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { useI18n } from "@/components/layout/i18n-provider";

import { Heading, TypographyMuted } from "@/shadcn/components/ui/typography";
import { DataTable } from "@/components/ui/data-table/data-table";
import { getOrdersColumns } from "./columns";

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
					<Heading as="h4">Your Orders</Heading>
					<TypographyMuted className="text-sm">
						(
						{(orders.length === 1 ? t("item") : t("items")).replace(
							"{{count}}",
							String(orders.length),
						)}
						)
					</TypographyMuted>
				</div>

				<DataTable columns={getOrdersColumns} data={orders} />
			</Section>
		</Container>
	);
}
