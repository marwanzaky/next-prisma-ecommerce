"use client";

import * as React from "react";

import { type Table } from "@tanstack/react-table";

import { Input } from "@/shadcn/components/ui/input";

import { DataTableViewOptions } from "./data-table-view-options";

type DataTableToolbarSearch = {
	columnId: string;
	placeholder?: string;
	className?: string;
};

export function DataTableToolbar<TData>({
	table,
	search,
	children,
	className,
	showViewOptions = true,
}: {
	table: Table<TData>;
	search?: DataTableToolbarSearch;
	children?: React.ReactNode;
	className?: string;
	showViewOptions?: boolean;
}) {
	return (
		<div className={className ?? "flex items-center gap-2 py-4"}>
			{search ? (
				<Input
					placeholder={search.placeholder}
					value={
						(table.getColumn(search.columnId)?.getFilterValue() as string) ?? ""
					}
					onChange={(event) =>
						table
							.getColumn(search.columnId)
							?.setFilterValue(event.target.value)
					}
					className={search.className ?? "max-w-sm"}
				/>
			) : null}

			{showViewOptions ? <DataTableViewOptions table={table} /> : null}
			{children}
		</div>
	);
}

