export type CreateCategory = Omit<Category, "id" | "isActive">;
export type UpdateCategory = Partial<Omit<Category, "id">>;

export type Category = {
	id: string;
	name: string;
	slug: string;
	sortOrder: number;
	isActive: boolean;
	parent?: string | null;
	imgUrl?: string;
};

export type PublicCategory = Pick<
	Category,
	"id" | "name" | "slug" | "parent" | "imgUrl"
>;

export type PublicCategoryTree = Omit<PublicCategory, "parent"> & {
	children: PublicCategoryTree[];
};
