import { PublicCategory, PublicCategoryTree } from "@repo/types";

import { clientFetch } from "@/lib/api-client";

export const categoriesService = {
	getAllCategories: () => clientFetch<PublicCategory[]>("/categories"),
	getCategoryTree: () => clientFetch<PublicCategoryTree[]>("/categories/tree"),
};
