"use client";

import { Table } from "@shared/components/ui/table";

import { useSell } from "@hooks/use-sell";

import { Section } from "@shared/components/ui/section";
import { Heading } from "@shadcn/components/ui/typography";

import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@shadcn/components/ui/empty";
import { Button } from "@shadcn/components/ui/button";
import { useRouter } from "next/navigation";

export default function Page() {
	const router = useRouter();
	const { columns, tableData } = useSell();

	return (
		<Section className="max-w-2xl mx-auto space-y-2 lg:space-y-4">
			<Heading as="h4" className="text-center">
				Your Products
			</Heading>

			{tableData.length > 0 ? (
				<div className="flex flex-col gap-4">
					<Table columns={columns} data={tableData}></Table>

					<div className="flex justify-end">
						<Button
							className="mr-0!"
							onClick={() => {
								router.push("/store/products/new");
							}}
						>
							Add product
						</Button>
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
								router.push("/store/products/new");
							}}
						>
							Add product
						</Button>
					</EmptyContent>
				</Empty>
			)}
		</Section>
	);
}
