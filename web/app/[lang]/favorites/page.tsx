"use client";
import { useRouter } from "next/navigation";

import { useAppSelector } from "@/redux/store";

import { Container } from "@/components/common/container";
import ProductCard from "@/components/common/product-card";
import { Section } from "@/components/common/section";
import { useI18n } from "@/components/layout/i18n-provider";

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

export default function Page() {
	const router = useRouter();
	const { locale, t } = useI18n();
	const { items } = useAppSelector((state) => state.favorites);

	return (
		<Container>
			<Section className="space-y-2 lg:space-y-4">
				<div className="flex justify-center items-center gap-2">
					<Heading as="h4">{t("favoritesPage.title")}</Heading>
					<TypographyMuted className="text-sm">
						(
						{(items.length === 1 ? t("item") : t("items")).replace(
							"{{count}}",
							String(items.length),
						)}
						)
					</TypographyMuted>
				</div>

				{items.length > 0 ? (
					<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
						{items.map((item) => (
							<ProductCard data={item} key={item._id} />
						))}
					</div>
				) : (
					<Empty className="border border-dashed">
						<EmptyHeader>
							<EmptyTitle>{t("favoritesPage.emptyTitle")}</EmptyTitle>
							<EmptyDescription className="max-w-xs text-pretty">
								{t("favoritesPage.emptyDescription")}
							</EmptyDescription>
						</EmptyHeader>
						<EmptyContent>
							<Button
								variant="outline"
								onClick={() => router.push(localizePath("/products", locale))}
							>
								{t("favoritesPage.continueShopping")}
							</Button>
						</EmptyContent>
					</Empty>
				)}
			</Section>
		</Container>
	);
}
