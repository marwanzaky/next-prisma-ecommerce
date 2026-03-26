"use client";

import { SortOption, useProducts } from "@hooks/useProducts";

import ProductItem from "@shared/ui/productCart";
import { Chip } from "@shared/components/chip";
import { Section } from "@shared/components/section";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@shared/shadcn/select";
import { Button } from "@shared/shadcn/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@shared/shadcn/dialog";
import { TypographyP } from "@shared/shadcn/typography";
import { InputCurrencyRange } from "@shared/components/InputCurrencyRange";
import RadioWithLabel from "@shared/components/radioWithLabel";
import { InputText } from "@shared/components/inputText";

import { formatPrice } from "@utils/formatPrice";

export default function Page() {
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
							All filters
						</Button>

						<div className="flex flex-1 items-center gap-2 scrollbar-hide overflow-auto">
							{name && name !== undefined && (
								<Chip onClick={clearName}>Search &quot;{name}&quot;</Chip>
							)}
							{category && category !== undefined && (
								<Chip onClick={clearCategory}>Category: {category}</Chip>
							)}
							{minPrice && maxPrice && (
								<Chip onClick={clearPriceRange}>
									{formatPrice(minPrice)} - {formatPrice(maxPrice)}
								</Chip>
							)}
							{minPrice != undefined && maxPrice == null && (
								<Chip onClick={clearPriceRange}>
									Above {formatPrice(minPrice)}
								</Chip>
							)}
							{minPrice == null && maxPrice != undefined && (
								<Chip onClick={clearPriceRange}>
									Under {formatPrice(maxPrice)}
								</Chip>
							)}

							{rating !== undefined && rating === 5 && (
								<Chip onClick={clearRating}>5 Rating</Chip>
							)}
							{rating !== undefined && rating === 4 && (
								<Chip onClick={clearRating}>4.0+ Rating</Chip>
							)}
							{rating !== undefined && rating === 3 && (
								<Chip onClick={clearRating}>3.0+ Rating</Chip>
							)}
							{rating !== undefined && rating === 2 && (
								<Chip onClick={clearRating}>2.0+ Rating</Chip>
							)}
							{rating !== undefined && rating === 1 && (
								<Chip onClick={clearRating}>1.0+ Rating</Chip>
							)}
						</div>
					</div>

					<div className="flex justify-end items-center gap-4 flex-shrink-0">
						{isLoading === false && (
							<TypographyP className="text-muted-foreground hidden sm:block">
								Showing {data?.length} Products
							</TypographyP>
						)}

						<div className="flex items-center gap-2">
							<TypographyP className="hidden sm:block whitespace-nowrap">
								Sort by:
							</TypographyP>

							<Select
								value={sort}
								onValueChange={(value) => setSort(value as SortOption)}
							>
								<SelectTrigger>
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
					{data?.map((item) => (
						<ProductItem key={item._id} data={item} />
					))}
				</div>
			</Section>

			<Dialog open={visible} onOpenChange={setVisible}>
				<DialogContent
					className="sm:max-w-[24rem]"
					onSubmit={(e) => {
						e.preventDefault();
						applyFilters();
					}}
				>
					<DialogHeader>
						<DialogTitle>Filters</DialogTitle>
					</DialogHeader>

					<form>
						<div className="flex flex-col gap-4">
							<Select
								value={draftCategory}
								onValueChange={(value) => setDraftCategory(value)}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select Category" />
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

							<InputText
								size="sm"
								placeholder="Search for a product"
								icon="search"
								value={draftName || ""}
								onChange={(event) => setDraftName(event.target.value)}
							/>

							<InputCurrencyRange
								minValue={draftMinPrice}
								maxValue={draftMaxPrice}
								onMinChange={(value) => setDraftMinPrice(value)}
								onMaxChange={(value) => setDraftMaxPrice(value)}
							/>

							<div className="flex flex-col gap-2">
								<RadioWithLabel
									name="rate"
									id="rate5"
									value="rate5"
									checked={draftRating === 5}
									onChange={(e) => setDraftRating(5)}
									label="★★★★★"
									labelClassName="text-[1rem] text-[1rem] text-custom-primary-foreground"
								/>
								<RadioWithLabel
									name="rate"
									id="rate4"
									value="rate4"
									checked={draftRating === 4}
									onChange={(e) => setDraftRating(4)}
									label="★★★★"
									labelClassName="text-[1rem] text-custom-primary-foreground"
								/>
								<RadioWithLabel
									name="rate"
									id="rate3"
									value="rate3"
									checked={draftRating === 3}
									onChange={(e) => setDraftRating(3)}
									label="★★★"
									labelClassName="text-[1rem] text-custom-primary-foreground"
								/>
								<RadioWithLabel
									name="rate"
									id="rate2"
									value="rate2"
									checked={draftRating === 2}
									onChange={(e) => setDraftRating(2)}
									label="★★"
									labelClassName="text-[1rem] text-custom-primary-foreground"
								/>
								<RadioWithLabel
									name="rate"
									id="rate1"
									value="rate1"
									checked={draftRating === 1}
									onChange={(e) => setDraftRating(1)}
									label="★"
									labelClassName="text-[1rem] text-custom-primary-foreground"
								/>
							</div>
						</div>

						<DialogFooter className="mt-4">
							<Button variant="ghost" onClick={cancelFilters}>
								Cancel
							</Button>

							<Button type="submit">Apply filter</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
