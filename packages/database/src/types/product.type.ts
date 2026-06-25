import { Prisma } from "../../generated/prisma/client";

export type { Product } from "../../generated/prisma/client";

export type CreateProduct = {
	name: string;
	description: string;
	shortDescription?: string;
	tags?: string[];
	stock?: number;
	categoryId?: string | null;
	options: {
		name: string;
		position: number;
		values: {
			value: string;
			position: number;
		}[];
	}[];
	variants: CreateProductVariant[];
};

export type UpdateProduct = Partial<CreateProduct>;

export type CreateProductVariant = {
	title: string;
	price: number;
	compareAtPrice: number;
	stock: number;
	selections?: {
		optionName: string;
		optionValue: string;
	}[];
	sku: string;
	newImgs?: {
		file: File;
		index: number;
	}[];
	keptImgs?: {
		url: string;
		index: number;
	}[];
};

export type UpdateProductVariant = Omit<
	Prisma.ProductVariantUpdateInput,
	"selections"
> & {
	selections?: {
		optionName: string;
		optionValue: string;
	}[];
	newImgs?: {
		file: File;
		index: number;
	}[];
	keptImgs?: {
		url: string;
		index: number;
	}[];
};

export const productWithCategory = {
	include: {
		category: true,
	},
} satisfies Prisma.ProductDefaultArgs;

export type ProductWithCategory = Prisma.ProductGetPayload<
	typeof productWithCategory
>;

export const productWithVariantsReviewsUser = {
	include: {
		options: {
			include: { values: true },
		},
		variants: {
			include: {
				selections: {
					include: {
						option: true,
						optionValue: true,
					},
				},
			},
		},
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

export type ProductWithVariantsReviewsUser = Prisma.ProductGetPayload<
	typeof productWithVariantsReviewsUser
>;

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
