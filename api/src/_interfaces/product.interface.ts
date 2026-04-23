import { ProductEntity } from "@shared/product.types";

export type CreateProductEntity = Partial<
	Pick<
		ProductEntity,
		| "name"
		| "price"
		| "priceCompare"
		| "imgUrls"
		| "description"
		| "tags"
		| "stock"
		| "category"
	>
>;

export type UpdateProductEntity = Partial<CreateProductEntity>;
