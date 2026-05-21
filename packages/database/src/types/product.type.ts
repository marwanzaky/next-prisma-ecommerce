import { Prisma, Product as ProductType } from "../../generated/prisma/client";

type TranslatedText = {
	en: string;
	fr: string;
	ar: string;
};

type Rating = 1 | 2 | 3 | 4 | 5;

type RatingDistribution = Record<Rating, number>;

export type ProductTranslatedText = Omit<
	ProductType,
	"name" | "description" | "shortDescription"
> & {
	name: TranslatedText;
	description: TranslatedText;
	shortDescription: TranslatedText;
};

export type CreateProduct = {
	name: string;
	price: number;
	priceCompare: number;
	description: string;
	shortDescription?: string;
	tags?: string[];
	stock?: number;
	categoryId?: string | null;
	imgFiles?: File[];
};

export type UpdateProduct = Partial<Omit<CreateProduct, "imgFiles">> & {
	newImgs?: {
		file: File;
		index: number;
	}[];
	keptImgs?: {
		url: string;
		index: number;
	}[];
};

const productWithReviewsAndUser = {
	include: {
		reviews: {
			include: {
				user: {
					select: {
						id: true,
						name: true,
						avatarUrl: true,
					},
				},
			},
		},
		user: {
			select: {
				id: true,
				name: true,
				avatarUrl: true,
				createdAt: true,
				updatedAt: true,
			},
		},
	},
} satisfies Prisma.ProductDefaultArgs;

export type ProductWithReviewsAndUserRaw = Prisma.ProductGetPayload<
	typeof productWithReviewsAndUser
>;

export type ProductWithReviewsAndUser = Omit<
	Prisma.ProductGetPayload<typeof productWithReviewsAndUser>,
	"name" | "description" | "shortDescription" | "ratingDistribution"
> & {
	name: TranslatedText;
	description: TranslatedText;
	shortDescription: TranslatedText;
	ratingDistribution: RatingDistribution;
};

export type GetAllProducts = {
	sortProperty?: string;
	sortOrder?: "asc" | "desc";
	name?: string;
	excludeIds?: string[];
	minPrice?: number;
	maxPrice?: number;
	featured?: boolean;
	isHero?: boolean;
	limit?: number;
	avgRatings?: number;
	categoryId?: string | null;
};
