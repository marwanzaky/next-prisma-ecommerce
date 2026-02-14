"use client";

import { Table } from "_shared/components/table";

import { useSell } from "@hooks/useSell";

import { Section } from "_shared/components/section";
import { Button } from "_shared/shadcn/button";
import { TypographyH4 } from "_shared/shadcn/typography";

import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "_shared/components/empty";

export default function Page() {
	const {
		columns,
		tableData,
		resetForm,
		setDisplayDialog,
		AddProductDialog,
		EditProductDialog,
	} = useSell();

	return (
		<Section className="space-y-4">
			<TypographyH4 className="text-center">Your Products</TypographyH4>

			{tableData.length > 0 ? (
				<div className="flex flex-col gap-4">
					<Table columns={columns} data={tableData}></Table>

					<div className="flex justify-end">
						<Button
							className="!mr-0"
							onClick={() => {
								resetForm();
								setDisplayDialog(true);
							}}
						>
							Add item
						</Button>
						{AddProductDialog}
					</div>
				</div>
			) : (
				<Empty className="border border-dashed">
					<EmptyHeader>
						<EmptyTitle>Nothing here... yet.</EmptyTitle>
						<EmptyDescription className="max-w-xs text-pretty">
							Get started by creating your first product.
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<Button
							variant="outline"
							onClick={() => {
								resetForm();
								setDisplayDialog(true);
							}}
						>
							Add
						</Button>
					</EmptyContent>
				</Empty>
			)}

			{EditProductDialog}
		</Section>
	);
}
