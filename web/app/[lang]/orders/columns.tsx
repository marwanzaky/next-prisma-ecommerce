import Link from "next/link";

import { EyeIcon } from "lucide-react";

import { Order } from "@repo/database";
import { ColumnDef } from "@tanstack/react-table";

import { formatDate } from "@repo/types";

import { Badge } from "@/shadcn/components/ui/badge";
import { Button } from "@/shadcn/components/ui/button";

import { localizePath } from "@/lib/i18n";
import { formatPrice } from "@/lib/string-utils";

export const getOrdersColumns: ColumnDef<Order>[] = [
	{
		accessorKey: "stripeSessionId",
		header: "Order",
		cell: ({ row }) => {
			return row.original.stripeSessionId ? (
				<Link
					href={localizePath(`/orders/${row.original.id}`, "en")}
					className="hover:underline"
				>
					#{row.original.stripeSessionId?.slice(0, 20)}
				</Link>
			) : (
				<></>
			);
		},
	},
	{
		accessorKey: "createdAt",
		header: "Date",
		cell: ({ row }) => formatDate(row.original.createdAt),
	},
	{
		accessorKey: "status",
		header: "Payment",
		cell: ({ row }) => {
			if (row.original.status === "PAID")
				return (
					<Badge className="bg-green-600/10 text-green-600">
						{row.original.status}
					</Badge>
				);
			if (row.original.status === "PENDING")
				return (
					<Badge className="bg-amber-600/10 text-amber-600">
						{row.original.status}
					</Badge>
				);
			if (row.original.status === "CANCELLED")
				return (
					<Badge className="bg-slate-600/10 text-slate-600">
						{row.original.status}
					</Badge>
				);

			if (row.original.status === "REFUNDED")
				return (
					<Badge className="bg-red-600/10 text-red-600">
						{row.original.status}
					</Badge>
				);
		},
	},
	{
		accessorKey: "fulfillment",
		header: "Shipping",
		cell: ({ row }) => {
			if (row.original.fulfillment === "UNFULFILLED")
				return (
					<Badge className="bg-slate-600/10 text-slate-600">
						{row.original.fulfillment}
					</Badge>
				);
			if (row.original.fulfillment === "DELIVERED")
				return (
					<Badge className="bg-green-600/10 text-green-600">
						{row.original.fulfillment}
					</Badge>
				);
			if (row.original.fulfillment === "PROCESSING")
				return (
					<Badge className="bg-amber-600/10 text-amber-600">
						{row.original.fulfillment}
					</Badge>
				);
			if (row.original.fulfillment === "SHIPPED")
				return (
					<Badge className="bg-blue-600/10 text-blue-600">
						{row.original.fulfillment}
					</Badge>
				);
		},
	},
	{
		accessorKey: "totalAmount",
		header: "Total",
		cell: ({ row }) => formatPrice(row.original.totalAmount / 100, "en"),
	},
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => {
			return (
				<Link href={localizePath(`orders/${row.original.id}`, "en")}>
					<Button
						variant="ghost"
						size="icon"
						className="rounded-full"
						onClick={() => {}}
					>
						<EyeIcon />
					</Button>
				</Link>
			);
		},
	},
];
