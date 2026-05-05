"use client";

import { Container } from "@/components/common/container";
import ProductCard from "@/components/common/product-card";
import ProductCardSkeleton from "@/components/common/product-card-skeleton";
import { Section } from "@/components/common/section";
import { useI18n } from "@/components/layout/i18n-provider";
import { Chip } from "@/components/ui/chip";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shadcn/components/ui/select";
import { TypographyP } from "@/shadcn/components/ui/typography";

import { formatPrice } from "@/lib/string-utils";

import { SortOption } from "@/types/product.type";

import {
	ProductsProvider,
	useProductsContext,
} from "./components/products-context";
import ProductsFiltersDialog from "./components/products-filters-dialog";

export default function Page() {
	return (
		<ProductsProvider>
			<ProductsContent />
		</ProductsProvider>
	);
}

function ProductsContent() {
	const { locale, t } = useI18n();

	const {
		isLoading,
		data,

		name,
		category,
		minPrice,
		maxPrice,
		rating,
		options,

		setSort,
		sort,

		clearName,
		clearCategory,
		clearRating,
		clearPriceRange,
	} = useProductsContext();

	return (
		<Container>
			<Section>
				<div className="flex items-center justify-between gap-4 mb-4">
					<div className="flex items-center gap-4 flex-1 min-w-0">
						<ProductsFiltersDialog />

						<div className="flex flex-1 items-center gap-2 no-scrollbar overflow-auto">
							{name && name !== undefined && (
								<Chip onClick={clearName}>
									{t("productsPage.search")} &quot;{name}&quot;
								</Chip>
							)}
							{category && category !== undefined && (
								<Chip onClick={clearCategory}>
									{t("productsPage.category")}: {category}
								</Chip>
							)}
							{minPrice && maxPrice && (
								<Chip onClick={clearPriceRange}>
									{formatPrice(minPrice / 100, locale)} -{" "}
									{formatPrice(maxPrice / 100, locale)}
								</Chip>
							)}
							{minPrice != undefined && maxPrice == null && (
								<Chip onClick={clearPriceRange}>
									{t("productsPage.above")}{" "}
									{formatPrice(minPrice / 100, locale)}
								</Chip>
							)}
							{minPrice == null && maxPrice != undefined && (
								<Chip onClick={clearPriceRange}>
									{t("productsPage.under")}{" "}
									{formatPrice(maxPrice / 100, locale)}
								</Chip>
							)}

							{rating !== undefined && rating === 5 && (
								<Chip onClick={clearRating}>5 {t("productsPage.rating")}</Chip>
							)}
							{rating !== undefined && rating === 4 && (
								<Chip onClick={clearRating}>
									4.0+ {t("productsPage.rating")}
								</Chip>
							)}
							{rating !== undefined && rating === 3 && (
								<Chip onClick={clearRating}>
									3.0+ {t("productsPage.rating")}
								</Chip>
							)}
							{rating !== undefined && rating === 2 && (
								<Chip onClick={clearRating}>
									2.0+ {t("productsPage.rating")}
								</Chip>
							)}
							{rating !== undefined && rating === 1 && (
								<Chip onClick={clearRating}>
									1.0+ {t("productsPage.rating")}
								</Chip>
							)}
						</div>
					</div>

					<div className="flex justify-end items-center gap-4 shrink-0">
						{isLoading === false && (
							<TypographyP className="text-sm text-muted-foreground hidden sm:block">
								{t("productsPage.showingProducts").replace(
									"{{count}}",
									String(data?.length ?? 0),
								)}
							</TypographyP>
						)}

						<div className="flex items-center gap-2">
							<TypographyP className="text-sm hidden sm:block whitespace-nowrap">
								{t("productsPage.sortBy")}
							</TypographyP>

							<Select
								value={sort}
								onValueChange={(value) => setSort(value as SortOption)}
							>
								<SelectTrigger aria-label={sort}>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{options.map((item) => (
											<SelectItem
												key={`select-item-${item.value}`}
												value={item.value}
											>
												{item.label}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
					{!isLoading ? (
						data?.map((item) => <ProductCard key={item._id} data={item} />)
					) : (
						<>
							<ProductCardSkeleton />
							<ProductCardSkeleton />
							<ProductCardSkeleton />
							<ProductCardSkeleton />
							<ProductCardSkeleton />
							<ProductCardSkeleton />
							<ProductCardSkeleton />
							<ProductCardSkeleton />
						</>
					)}
				</div>
			</Section>
		</Container>
	);
}
