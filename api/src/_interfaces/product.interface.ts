export interface IProduct {
	_id: string;
	name: string;
	price: number;
	priceCompare: number;
	stock: number;
	discount: string;
	avgRatings: number;
	numReviews: number;
	/**
	 * base64s
	 */
	imgUrls: string[];
	description: string;
	tags: string[];
	featured: boolean;
}

export type CreateProduct = Partial<
	Pick<
		IProduct,
		| "name"
		| "price"
		| "priceCompare"
		| "imgUrls"
		| "description"
		| "tags"
		| "stock"
	>
>;

export type UpdateProduct = CreateProduct;
