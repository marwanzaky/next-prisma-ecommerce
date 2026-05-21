import { CartItemWithProduct } from "@repo/database";
import { Product } from "@repo/database";

const STORAGE_KEY = "guest_cart";

const getItems = (): CartItemWithProduct[] => {
	const raw = localStorage.getItem(STORAGE_KEY);
	return raw ? JSON.parse(raw) : [];
};

const saveItems = (items: CartItemWithProduct[]) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const guestCartService = {
	getMe: async (): Promise<{ items: CartItemWithProduct[] }> => {
		return { items: getItems() };
	},
	postItem: async (
		product: Product,
		quantity: number,
	): Promise<{ items: CartItemWithProduct[] }> => {
		const cartItems = getItems();
		const index = cartItems.findIndex((item) => item.productId === product.id);

		if (index > -1) {
			cartItems[index].quantity += quantity;
		} else {
			cartItems.push({
				quantity,
				cartId: "1234",
				id: "1234",
				productId: product.id,
				product,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
		}

		saveItems(cartItems);

		return {
			items: cartItems,
		};
	},

	updateItemQuantity: async (
		productId: string,
		quantity: number,
	): Promise<{ items: CartItemWithProduct[] }> => {
		const cartItems = getItems();
		const index = cartItems.findIndex((item) => item.productId === productId);

		if (index > -1) {
			if (quantity <= 0) {
				cartItems.splice(index, 1);
			} else {
				cartItems[index].quantity = quantity;
			}
		}

		saveItems(cartItems);
		return { items: cartItems };
	},

	deleteItem: async (
		productId: string,
	): Promise<{ items: CartItemWithProduct[] }> => {
		const cartItems = getItems().filter((item) => item.productId !== productId);
		saveItems(cartItems);
		return { items: cartItems };
	},
};
