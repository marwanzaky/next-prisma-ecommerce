import { stringify } from "qs";

import {
	CreateProduct,
	ProductEntity,
	ProductWithReviewsEntity,
	UpdateProduct,
} from "@repo/types";
import { ReviewEntity } from "@repo/types";

import { clientFetch } from "@/lib/api-client";
import { jsonToFormData } from "@/lib/helper";

import { GetAllProductsDto } from "@/types/get-all-products-dto.type";

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

		const paramsObj: GetAllProductsDto = {
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
			formData.append("imgFiles", file as any);
		});

		return clientFetch<ProductEntity>("/products", {
			method: "POST",
			body: formData,
		});
	},
	update: ({ id, update }: { id: string; update: UpdateProduct }) => {
		const formData = jsonToFormData({
			...update,
			newImgs: undefined,
			keptImgs: undefined,
		} satisfies UpdateProduct);

		update.newImgs?.forEach((img) => {
			formData.append("newImgs", img.file as any);
			formData.append("newImgsIndex", String(img.index));
		});

		update.keptImgs?.forEach((img) => {
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
