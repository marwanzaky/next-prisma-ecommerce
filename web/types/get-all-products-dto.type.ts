import { IProduct } from "./product.type";

export interface IGetAllProductsDto {
	sortProperty?: keyof IProduct;
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
}
