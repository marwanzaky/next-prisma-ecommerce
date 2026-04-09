"use client";

import { useSell } from "@app/store/products/use-sell";

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
import { DataTable } from "./data-table";

export default function Page() {
	const router = useRouter();
	const { columns, tableData } = useSell();

	return (
		<Section className="">
			<Heading as="h4" className="text-center">
				Your Products
			</Heading>

			{tableData.length > 0 ? (
				<DataTable columns={columns} data={tableData} />
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
