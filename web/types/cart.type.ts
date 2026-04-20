import { CartProduct, IProduct } from "@/types/product.type";

export type CartItem = {
	product: CartProduct;
	quantity: number;
};

export interface ICart {
	_id: string;
	user: string;
	items: CartItem[];
}
