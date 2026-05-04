"use client";

import { useI18n } from "@/components/layout/i18n-provider";
import { ButtonIcon } from "@/components/ui/button-icon";

import { Input } from "@/shadcn/components/ui/input";

import { formatPrice } from "@/lib/string-utils";
import { cn } from "@/lib/utils";

export type Column<T = any> = {
	field: keyof T;
	header: string;
	type:
		| "text"
		| "usd"
		| "custom"
		| "number-input"
		| "action"
		| "checkbox"
		| "date";
	className?: string;
	width?: string;

	render?: (value: any, row: T) => React.ReactNode;
	onChange?: (value: number, row: T) => void;

	action?: (row: T) => void;
	actionIcon?: string;
	actionAriaLabel?: string;
};

export type TableProps = {
	className?: string;
	columns: Column[];
	data: any[];
};

export function Table({ className, columns, data }: TableProps) {
	const { locale } = useI18n();
	return (
		<div
			className={cn(
				`w-full ring-1 ring-foreground/10 rounded-xl overflow-x-auto`,
				className,
			)}
		>
			<table className="w-full border-separate p-2.5">
				<thead>
					<tr>
						{columns.map((column, colIndex) => (
							<th
								key={`${column.field.toString()}-${colIndex}`}
								style={{ width: column.width }}
								className={`first:text-left p-2.5 ${column.className || ""}`}
							>
								{column.header}
							</th>
						))}
					</tr>
				</thead>

				<tbody>
					{data.map((row, rowIndex) => (
						<tr key={rowIndex}>
							{columns.map((column, colIndex) => (
								<td
									key={`${column.field.toString()}-${colIndex}`}
									style={{ width: column.width }}
									className={`px-2.5 h-16 text-center ${
										column.className || ""
									}`}
								>
									{column.type === "number-input" ? (
										<Input
											className="mx-auto"
											type="number"
											value={row[column.field]}
											onChange={(e) =>
												column.onChange &&
												column.onChange(Number(e.target.value), row)
											}
										/>
									) : column.type === "usd" ? (
										formatPrice(row[column.field] / 100, locale)
									) : column.type === "date" ? (
										new Date(row[column.field]).toLocaleDateString("en-GB")
									) : column.type === "custom" && column.render ? (
										column.render(row[column.field], row)
									) : column.type === "action" &&
									  column.action &&
									  column.actionIcon ? (
										<ButtonIcon
											icon={column.actionIcon}
											aria-label={column.actionAriaLabel}
											onClick={() => column.action!(row)}
										/>
									) : (
										row[column.field]
									)}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
