import { stringify } from "qs";

import {
	CreateProductReview,
	GetAllProducts,
	Review,
	UpdateProductReview,
	UpdateProductVariant,
} from "@repo/database";
import { CreateProduct, UpdateProduct } from "@repo/database";
import { ProductWithVariantsReviewsUserTranslatedText } from "@repo/database";

import { clientFetch } from "@/lib/api-client";

export const productsService = {
	getAllProducts: (params?: GetAllProducts) => {
		const paramsObj = stringify(params ?? {}, {
			skipNulls: true,
			arrayFormat: "repeat",
		});

		return clientFetch<ProductWithVariantsReviewsUserTranslatedText[]>(
			`/products?${paramsObj}`,
		);
	},
	getProduct: (id: string) =>
		clientFetch<ProductWithVariantsReviewsUserTranslatedText>(
			`/products/${id}`,
		),
	createProduct: (data: CreateProduct) => {
		const formData = new FormData();

		Object.entries(data).forEach(([key, value]) => {
			if (value === undefined || value === null) return;

			if (Array.isArray(value) || typeof value === "object") {
				formData.append(key, JSON.stringify(value));
				return;
			}

			formData.append(key, String(value));
		});

		return clientFetch<ProductWithVariantsReviewsUserTranslatedText>(
			"/products",
			{
				method: "POST",
				body: formData,
			},
		);
	},
	updateProduct: ({ id, data }: { id: string; data: UpdateProduct }) => {
		const formData = new FormData();

		Object.entries(data).forEach(([key, value]) => {
			if (value === undefined || value === null) return;

			if (Array.isArray(value) || typeof value === "object") {
				formData.append(key, JSON.stringify(value));
				return;
			}

			formData.append(key, String(value));
		});

		return clientFetch<ProductWithVariantsReviewsUserTranslatedText>(
			`/products/${id}`,
			{
				method: "PATCH",
				body: formData,
			},
		);
	},
	updateProductVariant: ({
		id,
		variantId,
		data,
	}: {
		id: string;
		variantId: string;
		data: UpdateProductVariant;
	}) => {
		const formData = new FormData();

		Object.entries(data).forEach(([key, value]) => {
			if (value === undefined || value === null) return;

			if (key === "newImgs") {
				const newImgs = (value as UpdateProductVariant["newImgs"]) || [];
				const indices = newImgs.map((img) => img.index);
				formData.append("newImgIndices", JSON.stringify(indices));

				newImgs.forEach((img) => {
					formData.append("imgFiles", img.file);
				});
				return;
			}

			if (Array.isArray(value) || typeof value === "object") {
				formData.append(key, JSON.stringify(value));
				return;
			}

			formData.append(key, String(value));
		});

		return clientFetch<ProductWithVariantsReviewsUserTranslatedText>(
			`/products/${id}/variants/${variantId}`,
			{
				method: "PATCH",
				body: formData,
			},
		);
	},
	remove: (id: string) =>
		clientFetch<null>(`/products/${id}`, {
			method: "DELETE",
		}),
	createProductReview: (params: { id: string; body: CreateProductReview }) =>
		clientFetch<Review>(`/products/${params.id}/reviews`, {
			method: "POST",
			body: JSON.stringify(params.body),
		}),
	updateProductReview: (params: { id: string; body: UpdateProductReview }) =>
		clientFetch<Review>(`/products/${params.id}/reviews`, {
			method: "PATCH",
			body: JSON.stringify(params.body),
		}),
};
