"use client";

import { StarIcon } from "lucide-react";

import { useI18n } from "@/components/layout/i18n-provider";

import { Button } from "@/shadcn/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shadcn/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/shadcn/components/ui/field";
import { Input } from "@/shadcn/components/ui/input";
import { Label } from "@/shadcn/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shadcn/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shadcn/components/ui/select";
import { TypographyP } from "@/shadcn/components/ui/typography";

import { Chip } from "@/shared/components/ui/chip";
import { InputCurrencyRange } from "@/shared/components/ui/input-currency-range";
import ProductCard from "@/shared/components/ui/product-card";
import ProductCardSkeleton from "@/shared/components/ui/product-card-skeleton";
import { Section } from "@/shared/components/ui/section";

import { formatPrice } from "@/utils/format";

import { SortOption } from "@/types/product.type";

import { useProducts } from "./use-products";

export default function Page() {
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
		categories,

		setSort,
		sort,
		visible,
		setVisible,

		draftName,
		setDraftName,
		draftCategory,
		setDraftCategory,
		draftMinPrice,
		setDraftMinPrice,
		draftMaxPrice,
		setDraftMaxPrice,
		draftRating,
		setDraftRating,

		openFilterDialog,

		clearName,
		clearCategory,
		clearRating,
		clearPriceRange,
		cancelFilters,

		applyFilters,
	} = useProducts();

	return (
		<div>
			<Section>
				<div className="flex items-center justify-between gap-4 mb-4">
					<div className="flex items-center gap-4 flex-1 min-w-0">
						<Button variant="outline" onClick={openFilterDialog}>
							{t("productsPage.allFilters")}
						</Button>

						<div className="flex flex-1 items-center gap-2 scrollbar-hide overflow-auto">
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

			<Dialog open={visible} onOpenChange={setVisible}>
				<DialogContent
					className="sm:max-w-sm"
					onSubmit={(e) => {
						e.preventDefault();
						applyFilters();
					}}
				>
					<DialogHeader>
						<DialogTitle>{t("productsPage.filters")}</DialogTitle>
					</DialogHeader>

					<form>
						<FieldGroup>
							<Field>
								<FieldLabel>{t("productsPage.category")}</FieldLabel>
								<Select
									value={draftCategory}
									onValueChange={(value) => setDraftCategory(value)}
								>
									<SelectTrigger>
										<SelectValue
											placeholder={t("productsPage.selectCategory")}
										/>
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											{categories?.map((cat) => (
												<SelectItem
													key={`select-item-${cat.slug}`}
													value={cat.slug}
												>
													{cat.name}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</Field>
							<Field>
								<FieldLabel htmlFor="name">{t("productsPage.name")}</FieldLabel>
								<Input
									id="name"
									placeholder={t("productsPage.namePlaceholder")}
									value={draftName || ""}
									onChange={(event) => setDraftName(event.target.value)}
								/>
							</Field>
							<Field>
								<FieldLabel>{t("productsPage.priceRange")}</FieldLabel>
								<InputCurrencyRange
									minValue={draftMinPrice}
									maxValue={draftMaxPrice}
									onMinChange={(value) => setDraftMinPrice(value)}
									onMaxChange={(value) => setDraftMaxPrice(value)}
								/>
							</Field>
							<Field className="mb-4">
								<FieldLabel>{t("productsPage.rating")}</FieldLabel>
								<RadioGroup
									className="gap-1"
									onValueChange={(value) => {
										setDraftRating(parseInt(value));
									}}
								>
									<div className="flex items-center gap-2">
										<RadioGroupItem value="5" id="option-5" />
										<Label className="gap-0.5" htmlFor="option-5">
											{[1, 2, 3, 4, 5].map((star) => (
												<StarIcon
													key={`star-${star}`}
													className={"h-4 w-4 fill-yellow-400 text-yellow-400"}
												/>
											))}
										</Label>
									</div>
									<div className="flex items-center gap-2">
										<RadioGroupItem value="4" id="option-4" />
										<Label className="gap-0.5" htmlFor="option-4">
											{[1, 2, 3, 4].map((star) => (
												<StarIcon
													key={`star-${star}`}
													className={"h-4 w-4 fill-yellow-400 text-yellow-400"}
												/>
											))}
										</Label>
									</div>

									<div className="flex items-center gap-2">
										<RadioGroupItem value="3" id="option-3" />
										<Label className="gap-0.5" htmlFor="option-3">
											{[1, 2, 3].map((star) => (
												<StarIcon
													key={`star-${star}`}
													className={"h-4 w-4 fill-yellow-400 text-yellow-400"}
												/>
											))}
										</Label>
									</div>

									<div className="flex items-center gap-2">
										<RadioGroupItem value="2" id="option-2" />
										<Label className="gap-0.5" htmlFor="option-2">
											{[1, 2].map((star) => (
												<StarIcon
													key={`star-${star}`}
													className={"h-4 w-4 fill-yellow-400 text-yellow-400"}
												/>
											))}
										</Label>
									</div>

									<div className="flex items-center gap-2">
										<RadioGroupItem value="1" id="option-1" />
										<Label htmlFor="option-1">
											<StarIcon
												className={"h-4 w-4 fill-yellow-400 text-yellow-400"}
											/>
										</Label>
									</div>
								</RadioGroup>
							</Field>
						</FieldGroup>

						<DialogFooter>
							<Button variant="outline" type="button" onClick={cancelFilters}>
								{t("buttons.cancel")}
							</Button>

							<Button type="submit">{t("productsPage.applyFilter")}</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
