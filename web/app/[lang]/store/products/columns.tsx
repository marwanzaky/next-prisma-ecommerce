"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ArrowUpDown, EyeIcon, PencilIcon, Trash2Icon } from "lucide-react";

import { Product, PublicCategoryTree } from "@repo/database";
import { ColumnDef, Row } from "@tanstack/react-table";

import { Locale, TranslatedText } from "@repo/types";

import { useI18n } from "@/components/layout/i18n-provider";

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
import { Avatar, AvatarImage } from "@/shadcn/components/ui/avatar";
import { Button } from "@/shadcn/components/ui/button";
import { Checkbox } from "@/shadcn/components/ui/checkbox";

import { localizePath } from "@/lib/i18n";
import { createProductSlug, formatPrice } from "@/lib/string-utils";

import { DictionaryKeys } from "@/types/i18n.type";

import { ProductInput } from "./use-sell";

export type SellProduct = Product & { imgUrl: string };

export const getVariantsColumns = ({
	productId,
	locale,
	t,
}: {
	productId?: string;
	locale: Locale;
	t: (key: DictionaryKeys, fallback?: string) => string;
}): ColumnDef<ProductInput["variants"][0]>[] => {
	const columns: ColumnDef<ProductInput["variants"][0]>[] = [
		{ accessorKey: "title", header: "Variant" },
		{
			accessorKey: "price",
			header: ({ column }) => (
				<Button
					variant="ghost"
					type="button"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					{t("storeProductsPage.table.price")}
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			),
			cell: ({ row }) => (
				<div>{formatPrice(row.original.priceRangeUsd.min, locale)}</div>
			),
		},
		{
			accessorKey: "stock",
			header: t("storeProductsPage.table.stock"),
		},
	];

	if (productId) {
		columns.push({
			id: "actions",
			cell: ({ row }) => {
				return row.original.variantId ? (
					<Link href={`${productId}/variants/${row.original.variantId}`}>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="rounded-full"
						>
							<PencilIcon />
						</Button>
					</Link>
				) : (
					<div className="h-8 w-8" />
				);
			},
		});
	}

	return columns;
};

export const getSellColumns = ({
	categoryTree,
	onDelete,
	locale,
	t,
}: {
	categoryTree: PublicCategoryTree[] | undefined;
	onDelete: (id: string) => void;
	locale: Locale;
	t: (key: DictionaryKeys, fallback?: string) => string;
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
				aria-label={t("storeProductsPage.table.selectAll")}
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label={t("storeProductsPage.table.selectRow")}
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "name",
		header: t("storeProductsPage.table.product"),
		cell: ({ row }) => {
			const href = localizePath(`store/products/${row.original.id}`, locale);
			const subcategory = categoryTree
				?.flatMap((cat) => [...cat.children, cat])
				.find((cat) => cat.id === row.original.categoryId);

			return (
				<div className="flex gap-3 items-center">
					<Link href={href}>
						<Avatar className="h-8 w-8 rounded-sm overflow-hidden">
							<AvatarImage
								className="rounded-none"
								src={row.original.imgUrl}
								alt={`${t("photoOf").replace("{{name}}", (row.original.name as TranslatedText)[locale])}`}
							/>
						</Avatar>
					</Link>

					<div>
						<div className="font-medium hover:text-primary transition-colors max-w-60 truncate">
							<Link href={href}>
								{(row.original.name as TranslatedText)[locale]}
							</Link>
						</div>
						<span className="text-muted-foreground text-xs">
							{subcategory?.name[locale]}
						</span>
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "categoryId",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				{t("storeProductsPage.table.category")}
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => {
			const productCategoryTree = categoryTree?.find((rootCat) =>
				rootCat.children.some(
					(childCat) => childCat.id === row.original.categoryId,
				),
			);

			return <div>{productCategoryTree?.name[locale]}</div>;
		},
	},
	{
		id: "actions",
		header: t("storeProductsPage.table.actions"),
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
	const { locale, t } = useI18n();
	const [showDeleteAlert, setShowDeleteAlert] = useState(false);
	const product = row.original;

	return (
		<>
			<div className="flex items-center gap-1">
				<Button
					variant="ghost"
					size="icon"
					className="rounded-full"
					aria-label={`product-${product.id}-remove`}
					onClick={() => {
						router.push(
							localizePath(
								`/products/${createProductSlug((row.original.name as TranslatedText).en, row.original.id)}`,
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
					aria-label={`product-${product.id}-edit`}
					onClick={() => {
						router.push(
							localizePath(`/store/products/${row.original.id}`, locale),
						);
					}}
				>
					<PencilIcon />
				</Button>

				<Button
					variant="ghost"
					size="icon"
					className="rounded-full"
					aria-label={`product-${product.id}-remove`}
					onClick={() => setShowDeleteAlert(true)}
				>
					<Trash2Icon />
				</Button>
			</div>

			<AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{t("storeProductsPage.table.deleteConfirmTitle")}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{t("storeProductsPage.table.deleteConfirmDescription")}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>{t("buttons.cancel")}</AlertDialogCancel>
						<AlertDialogAction onClick={() => onDelete(product.id)}>
							{t("buttons.continue")}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};
