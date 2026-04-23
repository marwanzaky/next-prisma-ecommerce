import { ProductEntity } from "./product.types";

/**
 * Mongodb cart product item document entity
 */
export type CartProductEntity = Pick<
	ProductEntity,
	"_id" | "name" | "imgUrls" | "price" | "priceCompare" | "category"
>;

export type CartItemEntity = { product: CartProductEntity; quantity: number };

/**
 * Mongodb cart document entity
 */
export type CartEntity = {
	_id: string;
	user: string;
	items: CartItemEntity[];
};
