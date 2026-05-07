import { CategoryEntity, CreateCategory, UpdateCategory } from "@repo/types";

import { clientFetch } from "@/lib/api-client";
import { jsonToFormData } from "@/lib/helper";

export const adminCategoriesService = {
	getAllCategories: () => clientFetch<CategoryEntity[]>("/admin/categories"),
	addCategory: (category: CreateCategory & { imgFile?: File }) => {
		const formData = jsonToFormData(category);
		return clientFetch<CategoryEntity[]>("/admin/categories", {
			method: "POST",
			body: formData,
		});
	},
	updateCategory: (
		id: string,
		category: UpdateCategory & { imgFile?: File | null },
	) => {
		const formData = jsonToFormData(category);
		return clientFetch<CategoryEntity>(`/admin/categories/${id}`, {
			method: "PATCH",
			body: formData,
		});
	},
};
