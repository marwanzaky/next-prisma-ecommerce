import {
	ICreateProduct,
	IGetAllProductsDto,
	IProduct,
	IUpdateProduct,
} from "@shared/interfaces";

import { stringify } from "qs";

import { jsonToFormData } from "@utils/helper";

import { clientFetch } from "@lib/api-client";

export type GetAllProductsOptions = {
	sort?: {
		property?: keyof IProduct;
		order?: "asc" | "desc";
	};
	query?: {
		excludeIds?: string[];
		name?: string;
		user?: string;
		minPrice?: number;
		maxPrice?: number;
		featured?: boolean;
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
		return clientFetch<IProduct[]>(`/products?${params}`);
	},
	getProduct: (id: string) => clientFetch<IProduct>(`/products/${id}`),
	post: (product: ICreateProduct) => {
		const formData = jsonToFormData({
			...product,
			imgFiles: undefined,
		} satisfies ICreateProduct);

		product.imgFiles?.forEach((file) => {
			formData.append("imgFiles", file);
		});

		return clientFetch<IProduct>("/products", {
			method: "POST",
			body: formData,
		});
	},
	update: (id: string, product: IUpdateProduct) => {
		const formData = jsonToFormData({
			...product,
			newImgs: undefined,
			keptImgs: undefined,
		} satisfies IUpdateProduct);

		product.newImgs?.forEach((img) => {
			formData.append("newImgs", img.file);
			formData.append("newImgsIndex", String(img.index));
		});

		product.keptImgs?.forEach((img) => {
			formData.append("keptImgsUrl", img.url);
			formData.append("keptImgsIndex", String(img.index));
		});

		return clientFetch<IProduct>(`/products/${id}`, {
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
		clientFetch<IProduct>(`/products/${product.id}/reviews`, {
			method: "POST",
			body: JSON.stringify({
				rating: product.rating,
				description: product.description,
			}),
		}),
};
