import { ProductEntity } from "@repo/types";

export type GetAllProductsDto = {
	sortProperty?: keyof ProductEntity;
	sortOrder?: "asc" | "desc";
	searchTerm?: string;

	excludeIds?: string[];

	/**
	 * Min price in cents
	 */
	minPrice?: number;

	/**
	 * Max price in cents
	 */
	maxPrice?: number;
};
