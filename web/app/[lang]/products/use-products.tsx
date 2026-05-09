"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { stringify } from "qs";

import { useQuery } from "@tanstack/react-query";

import { ProductEntity } from "@repo/types";

import { categoriesService } from "@/services/categories-service";
import {
	GetAllProductsOptions,
	productsService,
} from "@/services/products-service";

import { useI18n } from "@/components/layout/i18n-provider";

import { localizePath } from "@/lib/i18n";

import { ProductsPageParams, SortOption } from "@/types/product.type";

export function useProducts() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { locale, t } = useI18n();

	const initialParams = Object.fromEntries(
		searchParams.entries(),
	) as ProductsPageParams;

	const [sort, setSort] = useState<SortOption>(
		initialParams.sort || "relevancy",
	);

	const [name, setName] = useState<string | undefined>(initialParams.name);

	const [category, setCategory] = useState<string | undefined>(
		initialParams.category,
	);

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

	const [draftCategory, setDraftCategory] = useState<string | undefined>();

	const [draftMinPrice, setDraftMinPrice] = useState<number | undefined>(
		undefined,
	);
	const [draftMaxPrice, setDraftMaxPrice] = useState<number | undefined>(
		undefined,
	);

	const [draftRating, setDraftRating] = useState<number | undefined>(undefined);

	const sortMap: Record<
		SortOption,
		{ property: keyof ProductEntity; order: "asc" | "desc" }
	> = {
		relevancy: { property: "createdAt", order: "asc" },
		"most-popular": { property: "numReviews", order: "desc" },
		"low-price": { property: "price", order: "asc" },
		"high-price": { property: "price", order: "desc" },
	};

	const { data: categoryTree } = useQuery({
		queryKey: ["category-tree"],
		queryFn: () => categoriesService.getCategoryTree(),
		staleTime: 1000 * 60 * 5,
	});

	const categories = useMemo(() => {
		if (!categoryTree) return [];
		return categoryTree.flatMap((cat) => [...cat.children, cat]);
	}, [categoryTree]);

	const productsOptions: GetAllProductsOptions = {
		sort: sortMap[sort],
		query: {
			name,
			minPrice,
			maxPrice,
			avgRatings: rating,
			category: categories
				? categories.find((cat) => cat.slug === category)?._id
				: null,
		},
	};

	const { data, isLoading } = useQuery({
		queryKey: ["products", productsOptions],
		queryFn: () => productsService.getAllProducts(productsOptions),
		staleTime: 1000 * 60 * 5,
	});

	const options: { label: string; value: SortOption }[] = [
		{ label: t("productsPage.sort.relevancy"), value: "relevancy" },
		{ label: t("productsPage.sort.mostPopular"), value: "most-popular" },
		{ label: t("productsPage.sort.lowPrice"), value: "low-price" },
		{ label: t("productsPage.sort.highPrice"), value: "high-price" },
	];

	const [visible, setVisible] = useState(false);

	const updateParams = useCallback(() => {
		const params: ProductsPageParams = {
			name,
			sort,
			category,
			minPrice: minPrice?.toString(),
			maxPrice: maxPrice?.toString(),
			rating: rating?.toString(),
		};

		router.push(
			localizePath(
				`/products?${stringify(params, { skipNulls: true })}`,
				locale,
			),
		);
	}, [name, sort, category, minPrice, maxPrice, rating, locale, router]);

	const openFilterDialog = () => {
		setVisible(true);

		setDraftName(name);
		setDraftMaxPrice(maxPrice && maxPrice / 100);
		setDraftMinPrice(minPrice && minPrice / 100);
		setDraftRating(rating);
		setDraftCategory(category);
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

	const clearCategory = () => {
		setCategory(undefined);
	};

	const applyFilters = () => {
		setName(draftName);
		setMaxPrice(draftMaxPrice && draftMaxPrice * 100);
		setMinPrice(draftMinPrice && draftMinPrice * 100);
		setRating(draftRating);
		setVisible(false);
		setCategory(draftCategory);
	};

	const cancelFilters = () => {
		setVisible(false);
	};

	useEffect(() => {
		updateParams();
	}, [updateParams]);

	useEffect(() => {
		const params = Object.fromEntries(
			searchParams.entries(),
		) as ProductsPageParams;
		setName(params.name);
		setCategory(params.category);
	}, [searchParams]);

	return {
		isLoading,
		data,

		name,
		category,
		minPrice,
		maxPrice,
		rating,
		options,
		categories,

		sort,
		setSort,
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
	};
}
