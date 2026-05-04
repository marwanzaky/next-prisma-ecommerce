import {
	PublicCategory,
	PublicCategoryTree,
} from "@/shared/types/category.type";

import { clientFetch } from "@/lib/api-client";

export const categoriesService = {
	getAllCategories: () => clientFetch<PublicCategory[]>("/categories"),
	getCategoryTree: () => clientFetch<PublicCategoryTree[]>("/categories/tree"),
};
