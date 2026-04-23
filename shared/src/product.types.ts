import { EntityBase } from "./entity.type";
import { ReviewEntity } from "./review.type";
import { User } from "./user.type";

export type Rating = 1 | 2 | 3 | 4 | 5;
export type RatingDistribution = Record<Rating, number>;

/**
 * Mongodb product document entity
 */
export type ProductEntity = EntityBase & {
	name: string;
	price: number;
	priceCompare: number;
	isHero: boolean;
	stock: number;
	discount: string;
	avgRatings: number;
	numReviews: number;
	ratingDistribution: RatingDistribution;
	imgUrls: string[];
	description: string;
	shortDescription?: string;
	tags: string[];
	featured: boolean;
	category: string | null;
};

export type ProductWithReviewsEntity = ProductEntity & {
	reviews: (Pick<
		ReviewEntity,
		"_id" | "createdAt" | "description" | "rating"
	> & {
		product: { name: string };
		user: { _id: string; name: string; photoUrl: string };
	})[];
	user: Pick<User, "_id" | "name" | "photoUrl" | "updatedAt" | "createdAt">;
};

export type CreateProduct = Pick<
	ProductEntity,
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

export type UpdateProduct = Pick<
	Partial<ProductEntity>,
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
