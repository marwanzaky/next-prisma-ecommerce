import { stringify } from "qs";

import { GetAllProducts, ProductTranslatedText, Review } from "@repo/database";
import { CreateProduct, UpdateProduct } from "@repo/database";
import { ProductWithReviewsAndUser } from "@repo/database";

import { clientFetch } from "@/lib/api-client";
import { jsonToFormData } from "@/lib/helper";

export const productsService = {
	getAllProducts: (params?: GetAllProducts) => {
		const paramsObj = stringify(params ?? {}, {
			skipNulls: true,
			arrayFormat: "repeat",
		});

		return clientFetch<ProductTranslatedText[]>(`/products?${paramsObj}`);
	},
	getProduct: (id: string) =>
		clientFetch<ProductWithReviewsAndUser>(`/products/${id}`),
	createProduct: (data: CreateProduct) => {
		const formData = jsonToFormData({
			...data,
			imgFiles: undefined,
		} satisfies CreateProduct);

		data.imgFiles?.forEach((file) => {
			formData.append("imgFiles", file);
		});

		return clientFetch<ProductTranslatedText>("/products", {
			method: "POST",
			body: formData,
		});
	},
	updateProduct: ({ id, data }: { id: string; data: UpdateProduct }) => {
		const formData = new FormData();

		Object.entries(data).forEach(([key, value]) => {
			if (value === undefined || value === null) return;

			if (key === "newImgs") {
				const newImgs = (value as UpdateProduct["newImgs"]) || [];
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

		return clientFetch<ProductTranslatedText>(`/products/${id}`, {
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
		clientFetch<Review>(`/products/${product.id}/reviews`, {
			method: "POST",
			body: JSON.stringify({
				rating: product.rating,
				description: product.description,
			}),
		}),
};
