import { Types } from "mongoose";

export interface IProduct {
	_id: string;
	name: string;
	price: number;
	priceCompare: number;
	isHero: boolean;
	stock: number;
	discount: string;
	avgRatings: number;
	numReviews: number;
	imgUrls: string[];
	description: string;
	shortDescription?: string;
	tags: string[];
	featured: boolean;
	category: Types.ObjectId | null;
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
> & {
	category?: string | null;
};

export type UpdateProduct = Partial<CreateProduct>;
