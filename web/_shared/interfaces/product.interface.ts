import { IReview } from "./review.interface";

export interface IProduct {
	_id: string;
	name: string;
	price: number;
	priceCompare: number;
	discount: string;
	avgRatings: number;
	numReviews: number;
	reviews: IReview[];
	imgUrls: string[];
	description: string;
	tags: string[];
	createdAt: string;
	stock: number;
	category: string | null;
}

export type ICreateProduct = Pick<
	IProduct,
	| "name"
	| "price"
	| "priceCompare"
	| "description"
	| "tags"
	| "stock"
	| "category"
> & {
	imgFiles?: File[];
};

export type IUpdateProduct = Pick<
	Partial<IProduct>,
	| "name"
	| "price"
	| "priceCompare"
	| "description"
	| "tags"
	| "stock"
	| "category"
> & {
	newImgs?: {
		file: File;
		index: number;
	}[];
	keptImgs?: {
		url: string;
		index: number;
	}[];
};
