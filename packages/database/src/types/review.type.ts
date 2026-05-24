export type CreateProductReview = {
	rating: number;
	description?: string;
};

export type UpdateProductReview = {
	rating?: number;
	description?: string;
};
