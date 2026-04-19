"use client";

import { useRouter } from "next/navigation";

import { useSell } from "./use-sell";

import { Section } from "@/shared/components/ui/section";
import { Heading } from "@/shadcn/components/ui/typography";

import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@/shadcn/components/ui/empty";
import { Button } from "@/shadcn/components/ui/button";

import { DataTable } from "./data-table";
import { localizePath } from "@/lib/i18n";

import { useI18n } from "@/components/layout/i18n-provider";

export default function Page() {
	const router = useRouter();
	const { locale } = useI18n();
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
								router.push(localizePath("/store/products/new", locale));
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
