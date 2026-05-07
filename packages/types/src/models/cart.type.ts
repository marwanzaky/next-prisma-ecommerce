import { EntityBase } from "./entity.type.js";
import { ProductEntity } from "./product.types.js";

export type CartProductEntity = Pick<
	ProductEntity,
	"_id" | "name" | "imgUrls" | "price" | "priceCompare" | "category"
>;

export type CartItemEntity = { product: CartProductEntity; quantity: number };

export type CartEntity = EntityBase & {
	user: string;
	items: CartItemEntity[];
};
