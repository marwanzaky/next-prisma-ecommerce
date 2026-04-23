import { stringify } from "qs";

import {
	CreateProduct,
	ProductEntity,
	ProductWithReviewsEntity,
	UpdateProduct,
} from "@/shared/types/product.types";
import { ReviewEntity } from "@/shared/types/review.type";

import { clientFetch } from "@/lib/api-client";

import { jsonToFormData } from "@/utils/helper";

import { IGetAllProductsDto } from "@/types/get-all-products-dto.type";

export type GetAllProductsOptions = {
	sort?: {
		property?: keyof ProductEntity;
		order?: "asc" | "desc";
	};
	query?: {
		excludeIds?: string[];
		name?: string;
		user?: string;
		minPrice?: number;
		maxPrice?: number;
		featured?: boolean;
		isHero?: boolean;
		limit?: number;
		avgRatings?: number;
		category?: string | null;
	};
};

export const productsService = {
	getAllProducts: (options?: GetAllProductsOptions) => {
		const { sort = {}, query = {} } = options || {};

		const paramsObj: IGetAllProductsDto = {
			...query,
			sortProperty: sort.property,
			sortOrder: sort.order,
		};

		const params = stringify(paramsObj, {
			skipNulls: true,
			arrayFormat: "repeat",
		});
		return clientFetch<ProductEntity[]>(`/products?${params}`);
	},
	getProduct: (id: string) =>
		clientFetch<ProductWithReviewsEntity>(`/products/${id}`),
	post: (product: CreateProduct) => {
		const formData = jsonToFormData({
			...product,
			imgFiles: undefined,
		} satisfies CreateProduct);

		product.imgFiles?.forEach((file) => {
			formData.append("imgFiles", file);
		});

		return clientFetch<ProductEntity>("/products", {
			method: "POST",
			body: formData,
		});
	},
	update: (id: string, product: UpdateProduct) => {
		const formData = jsonToFormData({
			...product,
			newImgs: undefined,
			keptImgs: undefined,
		} satisfies UpdateProduct);

		product.newImgs?.forEach((img) => {
			formData.append("newImgs", img.file);
			formData.append("newImgsIndex", String(img.index));
		});

		product.keptImgs?.forEach((img) => {
			formData.append("keptImgsUrl", img.url);
			formData.append("keptImgsIndex", String(img.index));
		});

		return clientFetch<ProductEntity>(`/products/${id}`, {
			method: "PATCH",
			body: formData,
		});
	},
	remove: (id: string) =>
		clientFetch<null>(`/products/${id}`, {
			method: "DELETE",
		}),
	postProductReview: (product: {
		id: string;
		rating: number;
		description?: string;
	}) =>
		clientFetch<ReviewEntity>(`/products/${product.id}/reviews`, {
			method: "POST",
			body: JSON.stringify({
				rating: product.rating,
				description: product.description,
			}),
		}),
};
