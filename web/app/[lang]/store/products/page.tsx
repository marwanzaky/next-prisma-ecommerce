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

import { DataTable } from "@/shared/components/ui/data-table/data-table";
import { DataTableToolbar } from "@/shared/components/ui/data-table/data-table-toolbar";

import { localizePath } from "@/lib/i18n";

import { useI18n } from "@/components/layout/i18n-provider";

export default function Page() {
	const router = useRouter();
	const { locale, t } = useI18n();
	const { columns, tableData } = useSell();

	return (
		<Section className="">
			<Heading as="h4" className="text-center">
				{t("storeProductsPage.title")}
			</Heading>

			{tableData.length > 0 ? (
				<DataTable
					columns={columns}
					data={tableData}
					pagination
					emptyText={t("storeProductsPage.noResults")}
					renderToolbar={(table) => (
						<DataTableToolbar
							table={table}
							search={{
								columnId: "name",
								placeholder: t("storeProductsPage.filterPlaceholder"),
							}}
						>
							<Button
								onClick={() => {
									router.push(localizePath("/store/products/new", locale));
								}}
							>
								{t("storeProductsPage.addProduct")}
							</Button>
						</DataTableToolbar>
					)}
				/>
			) : (
				<Empty className="border border-dashed">
					<EmptyHeader>
						<EmptyTitle>{t("storeProductsPage.emptyTitle")}</EmptyTitle>
						<EmptyDescription className="max-w-xs text-pretty">
							{t("storeProductsPage.emptyDescription")}
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<Button
							variant="outline"
							onClick={() => {
								router.push(localizePath("/store/products/new", locale));
							}}
						>
							{t("storeProductsPage.addProduct")}
						</Button>
					</EmptyContent>
				</Empty>
			)}
		</Section>
	);
}
