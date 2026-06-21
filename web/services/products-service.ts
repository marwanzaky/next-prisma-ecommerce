import { stringify } from "qs";

import {
	CreateProductReview,
	GetAllProducts,
	Review,
	UpdateProductReview,
	UpdateProductVariant,
} from "@repo/database";
import { CreateProduct, UpdateProduct } from "@repo/database";
import { ProductWithVariantsReviewsUser } from "@repo/database";

import { clientFetch } from "@/lib/api-client";

export const productsService = {
	getAllProducts: (params?: GetAllProducts) => {
		const paramsObj = stringify(params ?? {}, {
			skipNulls: true,
			arrayFormat: "repeat",
		});

		return clientFetch<ProductWithVariantsReviewsUser[]>(
			`/products?${paramsObj}`,
		);
	},
	getProduct: (id: string) =>
		clientFetch<ProductWithVariantsReviewsUser>(`/products/${id}`),
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

		const hasVariants = data.variants ? data.variants.length > 1 : false;

		if (!hasVariants && data.variants) {
			const variant = data.variants[0];
			const newImgs = variant.newImgs || [];
			const indices = newImgs.map((img) => img.index);
			formData.append("newImgIndices", JSON.stringify(indices));

			newImgs.forEach((img) => {
				formData.append("imgFiles", img.file);
			});
		}

		return clientFetch<ProductWithVariantsReviewsUser>("/products", {
			method: "POST",
			body: formData,
		});
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

		const hasVariants = data.variants ? data.variants.length > 1 : false;

		if (!hasVariants && data.variants) {
			const variant = data.variants[0];
			const newImgs = variant.newImgs || [];
			const indices = newImgs.map((img) => img.index);
			formData.append("newImgIndices", JSON.stringify(indices));

			newImgs.forEach((img) => {
				formData.append("imgFiles", img.file);
			});
		}

		return clientFetch<ProductWithVariantsReviewsUser>(`/products/${id}`, {
			method: "PATCH",
			body: formData,
		});
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

		return clientFetch<ProductWithVariantsReviewsUser>(
			`/products/${id}/variants/${variantId}`,
			{
				method: "PATCH",
				body: formData,
			},
		);
	},
	removeProduct: (id: string) =>
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
