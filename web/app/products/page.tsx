"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
	GetAllProductsOptions,
	productsService,
} from "@redux/services/productsService";
import { useQuery } from "@tanstack/react-query";

import { stringify } from "qs";

import ProductItem from "_shared/ui/productCart";
import { IProduct } from "_shared/interfaces";
import { Chip } from "_shared/components/chip";
import { Section } from "_shared/components/section";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "_shared/shadcn/select";
import { Button } from "_shared/shadcn/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "_shared/shadcn/dialog";
import { TypographyP } from "_shared/shadcn/typography";
import { InputCurrencyRange } from "_shared/components/InputCurrencyRange";
import RadioWithLabel from "_shared/components/radioWithLabel";
import { InputText } from "_shared/components/inputText";

type SortOption = "relevancy" | "most-popular" | "low-price" | "high-price";

export type ProductsPageParams = {
	name: string | undefined;
	sort: SortOption;
	minPrice: string | undefined;
	maxPrice: string | undefined;
	rating: string | undefined;
};

export default function Page() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const initialParams = Object.fromEntries(
		searchParams.entries(),
	) as ProductsPageParams;

	const [sort, setSort] = useState<SortOption>(
		initialParams.sort || "relevancy",
	);

	const [name, setName] = useState<string | undefined>();

	const [minPrice, setMinPrice] = useState<number | undefined>(
		initialParams.minPrice ? parseInt(initialParams.minPrice) : undefined,
	);
	const [maxPrice, setMaxPrice] = useState<number | undefined>(
		initialParams.maxPrice ? parseInt(initialParams.maxPrice) : undefined,
	);

	const [rating, setRating] = useState<number | undefined>(
		initialParams.rating ? parseInt(initialParams.rating) : undefined,
	);

	const [draftName, setDraftName] = useState<string | undefined>();

	const [draftMinPrice, setDraftMinPrice] = useState<number | undefined>(
		undefined,
	);
	const [draftMaxPrice, setDraftMaxPrice] = useState<number | undefined>(
		undefined,
	);

	const [draftRating, setDraftRating] = useState<number | undefined>(undefined);

	const sortMap: Record<
		SortOption,
		{ property: keyof IProduct; order: "asc" | "desc" }
	> = {
		relevancy: { property: "createdAt", order: "asc" },
		"most-popular": { property: "numReviews", order: "desc" },
		"low-price": { property: "price", order: "asc" },
		"high-price": { property: "price", order: "desc" },
	};

	const productsOptions: GetAllProductsOptions = {
		sort: sortMap[sort],
		query: {
			name,
			minPrice,
			maxPrice,
			avgRatings: rating,
		},
	};

	const { data, isLoading } = useQuery({
		queryKey: ["products", productsOptions],
		queryFn: () => productsService.getAllProducts(productsOptions),
		staleTime: 1000 * 60 * 5,
	});

	const options: { label: string; value: SortOption }[] = [
		{ label: "Relevancy", value: "relevancy" },
		{ label: "Most popular", value: "most-popular" },
		{ label: "Low price", value: "low-price" },
		{ label: "High price", value: "high-price" },
	];

	const [visible, setVisible] = useState(false);

	const updateParams = () => {
		const params: ProductsPageParams = {
			name,
			sort,
			minPrice: minPrice?.toString(),
			maxPrice: maxPrice?.toString(),
			rating: rating?.toString(),
		};

		router.push(`/products?${stringify(params, { skipNulls: true })}`);
	};

	const openFilterDialog = () => {
		setVisible(true);

		setDraftName(name);
		setDraftMaxPrice(maxPrice && maxPrice / 100);
		setDraftMinPrice(minPrice && minPrice / 100);
		setDraftRating(rating);
	};

	const clearPriceRange = () => {
		setMinPrice(undefined);
		setMaxPrice(undefined);
	};

	const clearRating = () => {
		setRating(undefined);
	};

	const clearName = () => {
		setName(undefined);
	};

	const applyFilters = () => {
		setName(draftName);
		setMaxPrice(draftMaxPrice && draftMaxPrice * 100);
		setMinPrice(draftMinPrice && draftMinPrice * 100);
		setRating(draftRating);
		setVisible(false);
	};

	const cancelFilters = () => {
		setVisible(false);
	};

	useEffect(() => {
		updateParams();
	}, [name, sort, minPrice, maxPrice, rating]);

	useEffect(() => {
		const params = Object.fromEntries(
			searchParams.entries(),
		) as ProductsPageParams;
		setName(params.name);
	}, [searchParams]);

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

							{minPrice && maxPrice && (
								<Chip onClick={clearPriceRange}>
									${(minPrice / 100).toFixed(2)} - $
									{(maxPrice / 100).toFixed(2)}
								</Chip>
							)}
							{minPrice != undefined && maxPrice == null && (
								<Chip onClick={clearPriceRange}>
									Above ${(minPrice / 100).toFixed(2)}
								</Chip>
							)}
							{minPrice == null && maxPrice != undefined && (
								<Chip onClick={clearPriceRange}>
									Under ${(maxPrice / 100).toFixed(2)}
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

				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-4">
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
