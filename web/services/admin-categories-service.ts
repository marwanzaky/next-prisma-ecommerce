import {
	CategoryTranslatedText,
	CreateCategory,
	UpdateCategory,
} from "@repo/database";

import { clientFetch } from "@/lib/api-client";
import { jsonToFormData } from "@/lib/helper";

export const adminCategoriesService = {
	getAllCategories: () =>
		clientFetch<CategoryTranslatedText[]>("/admin/categories"),
	createCategory: (category: CreateCategory) => {
		const formData = jsonToFormData(category);
		return clientFetch<CategoryTranslatedText[]>("/admin/categories", {
			method: "POST",
			body: formData,
		});
	},
	updateCategory: (id: string, category: UpdateCategory) => {
		const formData = jsonToFormData(category);
		return clientFetch<CategoryTranslatedText>(`/admin/categories/${id}`, {
			method: "PATCH",
			body: formData,
		});
	},
};
