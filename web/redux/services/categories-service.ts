import { clientFetch } from "@/lib/api-client";
import {
	PublicCategory,
	PublicCategoryTree,
} from "@/shared/types/category.type";

export const categoriesService = {
	getAllCategories: () => clientFetch<PublicCategory[]>("/categories"),
	getCategoryTree: () => clientFetch<PublicCategoryTree[]>("/categories/tree"),
};
