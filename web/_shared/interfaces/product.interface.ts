import { User } from "@shared/types/user.type";
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
	user?: Pick<User, "_id" | "name" | "photoUrl" | "updatedAt" | "createdAt">;
	imgUrls: string[];
	description: string;
	tags: string[];
	createdAt: string;
	updatedAt: string;
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
