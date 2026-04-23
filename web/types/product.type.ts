export type SortOption =
	| "relevancy"
	| "most-popular"
	| "low-price"
	| "high-price";

export type ProductsPageParams = {
	name: string | undefined;
	sort: SortOption;
	minPrice: string | undefined;
	maxPrice: string | undefined;
	rating: string | undefined;
	category: string | undefined;
};
