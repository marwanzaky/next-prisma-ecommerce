"use client";

import { ArrowUpDown, EyeIcon, PencilIcon, Trash2Icon } from "lucide-react";

import { IProduct } from "@/types/product.type";

import { ColumnDef, Row } from "@tanstack/react-table";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { formatPrice } from "@/utils/format";
import { createProductSlug } from "@/utils/string-utils";

import { Button } from "@/shadcn/components/ui/button";
import { Checkbox } from "@/shadcn/components/ui/checkbox";
import { Avatar, AvatarImage } from "@/shadcn/components/ui/avatar";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/shadcn/components/ui/alert-dialog";

import { PublicCategoryTree } from "@/shared/types/category.type";
import InputWithPlusMinusButtons from "@/shared/components/ui/input-with-plus-minus-buttons";

import { Locale, localizePath } from "@/lib/i18n";

import { useI18n } from "@/components/layout/i18n-provider";

export type SellProduct = IProduct & { imgUrl: string };

export const getSellColumns = ({
	categoryTree,
	onDelete,
	onStockChange,
	locale,
}: {
	categoryTree: PublicCategoryTree[] | undefined;
	onDelete: (id: string) => void;
	onStockChange: (id: string, value: number) => void;
	locale: Locale;
}): ColumnDef<SellProduct>[] => [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "name",
		header: "Product",
		cell: ({ row }) => {
			const product = row.original;
			const href = `${`products/${row.original._id}`}`;
			const productSubcategoryTree = categoryTree
				?.flatMap((cat) => [...cat.children, cat])
				.find((cat) => cat.id === product.category);

			return (
				<div className="flex gap-3 items-center">
					<Link href={href}>
						<Avatar className="h-8 w-8 rounded-sm overflow-hidden">
							<AvatarImage
								className="rounded-none"
								src={row.original.imgUrl}
								alt={`Photo of "${row.original.name}"`}
							/>
						</Avatar>
					</Link>

					<div>
						<div className="font-medium hover:text-primary transition-colors max-w-60 truncate">
							<Link href={href}>{row.original.name}</Link>
						</div>
						<span className="text-muted-foreground text-xs">
							{productSubcategoryTree?.name}
						</span>
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "category",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Category
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const productCategoryTree = categoryTree?.find((rootCat) =>
				rootCat.children.some(
					(childCat) => childCat.id === row.original.category,
				),
			);

			return <div>{productCategoryTree?.name}</div>;
		},
	},
	{
		accessorKey: "price",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Price
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div>{formatPrice(row.original.price / 100, locale)}</div>
		),
	},
	{
		accessorKey: "priceCompare",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Compare
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div>{formatPrice(row.original.priceCompare / 100, locale)}</div>
		),
	},
	{
		accessorKey: "stock",
		header: "Stock",
		cell: ({ row }) => (
			<InputWithPlusMinusButtons
				min={0}
				className="w-28"
				size="icon-lg"
				value={row.original.stock}
				onChange={(value) => onStockChange(row.original._id, value)}
			/>
		),
	},
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => {
			return <ActionsCell row={row} onDelete={onDelete} />;
		},
	},
];

const ActionsCell = ({
	row,
	onDelete,
}: {
	row: Row<SellProduct>;
	onDelete: (id: string) => void;
}) => {
	const router = useRouter();
	const { locale } = useI18n();
	const [showDeleteAlert, setShowDeleteAlert] = useState(false);
	const product = row.original;

	return (
		<>
			<div className="flex items-center gap-1">
				<Button
					variant="ghost"
					size="icon"
					className="rounded-full"
					aria-label={`product-${product._id}-remove`}
					onClick={() => {
						router.push(
							localizePath(
								`/products/${createProductSlug(row.original.name, row.original._id)}`,
								locale,
							),
						);
					}}
				>
					<EyeIcon />
				</Button>

				<Button
					variant="ghost"
					size="icon"
					className="rounded-full"
					aria-label={`product-${product._id}-edit`}
					onClick={() => {
						router.push(
							localizePath(`/store/products/${row.original._id}`, locale),
						);
					}}
				>
					<PencilIcon />
				</Button>

				<Button
					variant="ghost"
					size="icon"
					className="rounded-full"
					aria-label={`product-${product._id}-remove`}
					onClick={() => setShowDeleteAlert(true)}
				>
					<Trash2Icon />
				</Button>
			</div>

			<AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							product data from our servers.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={() => onDelete(product._id)}>
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};
