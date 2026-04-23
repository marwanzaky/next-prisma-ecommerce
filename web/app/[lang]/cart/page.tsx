"use client";

import { useRouter } from "next/navigation";

import { Section } from "@/components/common/section";
import { useI18n } from "@/components/layout/i18n-provider";
import { DataTable } from "@/components/ui/data-table/data-table";

import { Button } from "@/shadcn/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@/shadcn/components/ui/empty";
import { Heading } from "@/shadcn/components/ui/typography";

import { localizePath } from "@/lib/i18n";

import CheckoutCard from "./components/checkout-card";
import { useCart } from "./use-cart";

export default function Page() {
	const router = useRouter();
	const { locale, t } = useI18n();

	const { items, columns, tableData } = useCart();

	return (
		<Section>
			<Heading as="h4" className="text-center mb-2 lg:mb-4">
				{t("cartPage.title")}
			</Heading>

			{items.length > 0 ? (
				<div className="flex gap-4 flex-col md:flex-row">
					<DataTable
						className="md:w-2/3 h-fit"
						columns={columns}
						data={tableData}
					/>

					<CheckoutCard />
				</div>
			) : (
				<Empty className="border border-dashed">
					<EmptyHeader>
						<EmptyTitle>{t("cartPage.empty.title")}</EmptyTitle>
						<EmptyDescription className="max-w-xs text-pretty">
							{t("cartPage.empty.description")}
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<Button
							variant="outline"
							onClick={() => router.push(localizePath("/products", locale))}
						>
							{t("cartPage.empty.continueShopping")}
						</Button>
					</EmptyContent>
				</Empty>
			)}
		</Section>
	);
}
