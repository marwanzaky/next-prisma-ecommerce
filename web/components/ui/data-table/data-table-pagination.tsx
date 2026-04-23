"use client";

import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";

import { type Table } from "@tanstack/react-table";

import { useI18n } from "@/components/layout/i18n-provider";

import { Button } from "@/shadcn/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shadcn/components/ui/select";

interface DataTablePaginationProps<TData> {
	table: Table<TData>;
	pageSizes?: number[];
}

function formatTemplate(
	template: string,
	vars: Record<string, string | number>,
) {
	return template.replace(/\{(\w+)\}/g, (_match, key) => `${vars[key] ?? ""}`);
}

export function DataTablePagination<TData>({
	table,
	pageSizes = [10, 20, 25, 30, 40, 50],
}: DataTablePaginationProps<TData>) {
	const { t } = useI18n();

	const selected = table.getFilteredSelectedRowModel().rows.length;
	const total = table.getFilteredRowModel().rows.length;

	const pageIndex = table.getState().pagination.pageIndex + 1;
	const pageCount = table.getPageCount();

	return (
		<div className="flex items-center justify-between px-2 gap-4">
			<div className="flex-1 text-sm text-muted-foreground truncate">
				{formatTemplate(t("dataTable.rowsSelected"), {
					selected,
					total,
				})}
			</div>

			<div className="flex items-center gap-4 lg:gap-6">
				<div className="flex items-center gap-2">
					<p className="text-sm font-medium">{t("dataTable.rowsPerPage")}</p>
					<Select
						value={`${table.getState().pagination.pageSize}`}
						onValueChange={(value) => {
							table.setPageSize(Number(value));
						}}
					>
						<SelectTrigger className="h-8 w-17.5">
							<SelectValue placeholder={table.getState().pagination.pageSize} />
						</SelectTrigger>
						<SelectContent side="top">
							{pageSizes.map((size) => (
								<SelectItem key={size} value={`${size}`}>
									{size}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex w-25 items-center justify-center text-sm font-medium">
					{formatTemplate(t("dataTable.pageOf"), {
						page: pageIndex,
						total: pageCount,
					})}
				</div>

				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="icon"
						className="hidden size-8 lg:flex"
						onClick={() => table.setPageIndex(0)}
						disabled={!table.getCanPreviousPage()}
					>
						<span className="sr-only">{t("dataTable.goToFirstPage")}</span>
						<ChevronsLeft />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="size-8"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						<span className="sr-only">{t("dataTable.goToPreviousPage")}</span>
						<ChevronLeft />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="size-8"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						<span className="sr-only">{t("dataTable.goToNextPage")}</span>
						<ChevronRight />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="hidden size-8 lg:flex"
						onClick={() => table.setPageIndex(table.getPageCount() - 1)}
						disabled={!table.getCanNextPage()}
					>
						<span className="sr-only">{t("dataTable.goToLastPage")}</span>
						<ChevronsRight />
					</Button>
				</div>
			</div>
		</div>
	);
}

