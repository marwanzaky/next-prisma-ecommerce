import { CategoryEntity, Locale } from "@repo/types";

import { Column } from "@/components/ui/table";
import { LogoCell } from "@/components/ui/table/cells/logo-cell";

import { Checkbox } from "@/shadcn/components/ui/checkbox";

export const getCategoriesColumns = ({
	locale,
	categories,
	onActiveChange,
	onSortChange,
	editAction,
}: {
	locale: Locale;
	categories: CategoryEntity[];
	onActiveChange: (value: boolean, row: CategoryEntity) => void;
	onSortChange: (value: number, row: CategoryEntity) => void;
	editAction: (row: CategoryEntity) => void;
}): Column<CategoryEntity>[] => [
	{
		header: "Active",
		field: "isActive",
		type: "custom",
		className: "text-center! w-0",
		render: (value: boolean, row) => {
			return (
				<div className="flex justify-center">
					<Checkbox
						id="category-checkbox"
						name="category-checkbox"
						checked={value}
						onClick={() => onActiveChange?.(!value, row)}
					/>
				</div>
			);
		},
	},
	{
		header: "Name",
		field: "imgUrl",
		type: "custom",
		className: "w-[40%]",
		render: (value, row) => {
			const params = new URLSearchParams();
			params.set("category", row.slug);

			return (
				<LogoCell
					href={`/products?${params.toString()}`}
					label={row.name[locale]}
					imgUrl={value}
				/>
			);
		},
	},
	{
		header: "Parent",
		field: "parent",
		type: "custom",
		className: "w-[15%]",
		render(value) {
			const parentCat = categories?.find((cat) => cat._id === value);
			return <div>{parentCat?.name[locale]}</div>;
		},
	},
	{
		header: "Slug",
		field: "slug",
		type: "text",
		className: "w-[15%]",
	},
	{
		header: "Sort",
		field: "sortOrder",
		type: "number-input",
		className: "w-[10%]",
		onChange: onSortChange,
	},
	{
		header: "",
		field: "_id",
		type: "action",
		className: "w-9.5",
		actionIcon: "edit",
		action: editAction,
	},
];
