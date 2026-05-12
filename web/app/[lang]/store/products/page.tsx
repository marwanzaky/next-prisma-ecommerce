"use client";

import { useRouter } from "next/navigation";

import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { useI18n } from "@/components/layout/i18n-provider";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";

import { Button } from "@/shadcn/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@/shadcn/components/ui/empty";
import { Heading, TypographyMuted } from "@/shadcn/components/ui/typography";

import { localizePath } from "@/lib/i18n";

import { useSell } from "./use-sell";

export default function Page() {
	const router = useRouter();
	const { locale, t } = useI18n();
	const { columns, tableData } = useSell();

	return (
		<Container>
			<Section>
				<div className="flex justify-center items-center gap-2">
					<Heading as="h4">{t("storeProductsPage.title")}</Heading>
					<TypographyMuted className="text-sm">
						(
						{(tableData.length === 1 ? t("item") : t("items")).replace(
							"{{count}}",
							String(tableData.length),
						)}
						)
					</TypographyMuted>
				</div>

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
		</Container>
	);
}
