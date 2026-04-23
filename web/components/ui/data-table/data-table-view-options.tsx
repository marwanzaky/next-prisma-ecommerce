"use client";

import { Settings2 } from "lucide-react";

import { type Table } from "@tanstack/react-table";

import { useI18n } from "@/components/layout/i18n-provider";

import { Button } from "@/shadcn/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shadcn/components/ui/dropdown-menu";

export function DataTableViewOptions<TData>({
	table,
	labelByColumnId,
}: {
	table: Table<TData>;
	labelByColumnId?: (columnId: string) => string;
}) {
	const { t } = useI18n();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="sm" className="ml-auto flex h-8 gap-2">
					<Settings2 />
					{t("dataTable.view")}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-40">
				<DropdownMenuLabel>{t("dataTable.toggleColumns")}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{table
					.getAllColumns()
					.filter(
						(column) =>
							typeof column.accessorFn !== "undefined" && column.getCanHide(),
					)
					.map((column) => (
						<DropdownMenuCheckboxItem
							key={column.id}
							className="capitalize"
							checked={column.getIsVisible()}
							onCheckedChange={(value) => column.toggleVisibility(!!value)}
						>
							{labelByColumnId?.(column.id) ?? keyToLabel(column.id)}
						</DropdownMenuCheckboxItem>
					))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function keyToLabel(key: string) {
	return key
		.replace(/([A-Z])/g, " $1")
		.replace(/^./, (str) => str.toUpperCase())
		.trim();
}

