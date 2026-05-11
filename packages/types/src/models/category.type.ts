import { EntityBase } from "./entity.type";
import { WithoutMongoMeta } from "./mongoose.type";
import { TranslatedText } from "./product.types";

export type CreateCategory = Omit<
	WithoutMongoMeta<CategoryEntity>,
	"name" | "isActive"
> & {
	name: string;
};
export type UpdateCategory = Partial<
	Omit<WithoutMongoMeta<CategoryEntity>, "name">
> & {
	name?: string;
};

export type CategoryEntity = EntityBase & {
	name: TranslatedText;
	slug: string;
	sortOrder: number;
	isActive: boolean;
	parent?: string | null;
	imgUrl?: string;
};

export type PublicCategory = Pick<
	CategoryEntity,
	"_id" | "name" | "slug" | "parent" | "imgUrl"
>;

export type PublicCategoryTree = Omit<PublicCategory, "parent"> & {
	productCount: number;
	children: PublicCategoryTree[];
};
