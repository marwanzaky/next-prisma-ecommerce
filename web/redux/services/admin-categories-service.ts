import {
	Category,
	CreateCategory,
	UpdateCategory,
} from "@/shared/types/category.type";

import { clientFetch } from "@/lib/api-client";

import { jsonToFormData } from "@/utils/helper";

export const adminCategoriesService = {
	getAllCategories: () => clientFetch<Category[]>("/admin/categories"),
	addCategory: (category: CreateCategory & { imgFile?: File }) => {
		const formData = jsonToFormData(category);
		return clientFetch<Category[]>("/admin/categories", {
			method: "POST",
			body: formData,
		});
	},
	updateCategory: (
		id: string,
		category: UpdateCategory & { imgFile?: File | null },
	) => {
		const formData = jsonToFormData(category);
		return clientFetch<Category>(`/admin/categories/${id}`, {
			method: "PATCH",
			body: formData,
		});
	},
};
