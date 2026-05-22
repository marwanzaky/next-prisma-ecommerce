import { PencilIcon } from "lucide-react";

import { CategoryTranslatedText } from "@repo/database";
import { ColumnDef } from "@tanstack/react-table";

import { Locale } from "@repo/types";

import InputWithPlusMinusButtons from "@/components/ui/input-with-plus-minus-buttons";
import { LogoCell } from "@/components/ui/table/cells/logo-cell";

import { Button } from "@/shadcn/components/ui/button";
import { Checkbox } from "@/shadcn/components/ui/checkbox";

import { DictionaryKeys } from "@/types/i18n.type";

export const getCategoriesColumns = ({
	locale,
	categories,
	onActiveChange,
	onSortChange,
	editAction,
	t,
}: {
	locale: Locale;
	categories: CategoryTranslatedText[];
	onActiveChange: (value: boolean, row: CategoryTranslatedText) => void;
	onSortChange: (value: number, row: CategoryTranslatedText) => void;
	editAction: (row: CategoryTranslatedText) => void;
	t: (key: DictionaryKeys, fallback?: string) => string;
}): ColumnDef<CategoryTranslatedText>[] => [
	{
		accessorKey: "isActive",
		header: () => <div className="flex justify-center">Active</div>,
		cell: ({ row }) => (
			<div className="flex justify-center">
				<Checkbox
					checked={row.original.isActive}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					onClick={() => onActiveChange?.(!row.original.isActive, row.original)}
					aria-label={t("storeProductsPage.table.selectRow")}
				/>
			</div>
		),
	},
	{
		header: "Name",
		accessorKey: "imgUrl",
		cell: ({ row }) => {
			const params = new URLSearchParams();
			params.set("category", row.original.slug);

			return (
				<LogoCell
					href={`/products?${params.toString()}`}
					label={row.original.name[locale]}
					imgUrl={row.original.imgUrl ?? undefined}
				/>
			);
		},
	},
	{
		header: "Parent",
		accessorKey: "parentId",
		cell({ row }) {
			const parentCat = categories?.find(
				(cat) => cat.id === row.original.parentId,
			);

			return <div>{parentCat?.name[locale]}</div>;
		},
	},
	{
		header: "Slug",
		accessorKey: "slug",
	},
	{
		header: "Sort",
		accessorKey: "sortOrder",
		cell: ({ row }) => (
			<InputWithPlusMinusButtons
				min={0}
				className="w-28"
				size="icon-lg"
				value={row.original.sortOrder}
				onChange={(value) => onSortChange(value, row.original)}
			/>
		),
	},
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => (
			<Button
				variant="ghost"
				size="icon"
				className="rounded-full"
				onClick={() => editAction(row.original)}
			>
				<PencilIcon />
			</Button>
		),
	},
];
