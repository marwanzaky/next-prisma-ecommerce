import { CartItemEntity, ProductEntity } from "@repo/types";

const STORAGE_KEY = "guest_cart";

const getItems = (): CartItemEntity[] => {
	const raw = localStorage.getItem(STORAGE_KEY);
	return raw ? JSON.parse(raw) : [];
};

const saveItems = (items: CartItemEntity[]) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const guestCartService = {
	getMe: async (): Promise<{ items: CartItemEntity[] }> => {
		return { items: getItems() };
	},

	postItem: async (
		product: ProductEntity,
		quantity: number,
	): Promise<{ items: CartItemEntity[] }> => {
		const cartItems = getItems();
		const index = cartItems.findIndex(
			(item) => item.product._id === product._id,
		);

		if (index > -1) {
			cartItems[index].quantity += quantity;
		} else {
			cartItems.push({ product, quantity });
		}

		saveItems(cartItems);
		return { items: cartItems };
	},

	updateItemQuantity: async (
		productId: string,
		quantity: number,
	): Promise<{ items: CartItemEntity[] }> => {
		const cartItems = getItems();
		const index = cartItems.findIndex((item) => item.product._id === productId);

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
	): Promise<{ items: CartItemEntity[] }> => {
		const cartItems = getItems().filter(
			(item) => item.product._id !== productId,
		);
		saveItems(cartItems);
		return { items: cartItems };
	},
};
