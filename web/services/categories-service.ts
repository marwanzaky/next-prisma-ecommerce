import { PublicCategory, PublicCategoryTree } from "@repo/database";

import { clientFetch } from "@/lib/api-client";

export const categoriesService = {
	getAllCategories: () => clientFetch<PublicCategory[]>("/categories"),
	getCategoryTree: () => clientFetch<PublicCategoryTree[]>("/categories/tree"),
};
