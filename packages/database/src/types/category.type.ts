import { Category as CategoryType } from "../../generated/prisma/client";

type TranslatedText = {
	en: string;
	fr: string;
	ar: string;
};

export type CategoryTranslatedText = Omit<CategoryType, "name"> & {
	name: TranslatedText;
};

export type CreateCategory = Pick<
	CategoryTranslatedText,
	"slug" | "sortOrder" | "parentId"
> & {
	name: string;
	imgFile?: File;
};

export type UpdateCategory = Partial<
	Pick<
		CategoryTranslatedText,
		"slug" | "sortOrder" | "parentId" | "isActive"
	> & {
		name: string;
		imgFile: File;
	}
>;

export type PublicCategory = Pick<
	CategoryTranslatedText,
	"id" | "name" | "slug" | "imgUrl" | "parentId"
>;

export type PublicCategoryTree = Omit<PublicCategory, "parentId"> & {
	productCount: number;
	children: PublicCategoryTree[];
};
