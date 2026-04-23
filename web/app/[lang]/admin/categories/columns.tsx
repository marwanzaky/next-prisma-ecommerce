import { Column } from "@/components/ui/table";
import { LogoCell } from "@/components/ui/table/cells/logo-cell";

import { Checkbox } from "@/shadcn/components/ui/checkbox";

import { Category } from "@/shared/types/category.type";

export const getCategoriesColumns = ({
	categories,
	onActiveChange,
	onSortChange,
	editAction,
}: {
	categories: Category[];
	onActiveChange: (value: boolean, row: Category) => void;
	onSortChange: (value: number, row: Category) => void;
	editAction: (row: Category) => void;
}): Column<Category>[] => [
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
					label={row.name}
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
			const parentCat = categories?.find((cat) => cat.id === value);
			return <div>{parentCat?.name}</div>;
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
		field: "id",
		type: "action",
		className: "w-9.5",
		actionIcon: "edit",
		action: editAction,
	},
];
