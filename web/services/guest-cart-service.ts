import {
	CartItemWithProductVariant,
	Product,
	ProductVariant,
} from "@repo/database";

const STORAGE_KEY = "guest_cart";

const getItems = (): CartItemWithProductVariant[] => {
	const raw = localStorage.getItem(STORAGE_KEY);
	return raw ? JSON.parse(raw) : [];
};

const saveItems = (items: CartItemWithProductVariant[]) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const guestCartService = {
	getMe: async (): Promise<{ items: CartItemWithProductVariant[] }> => {
		return { items: getItems() };
	},
	postItem: async (
		product: Product,
		variant: ProductVariant,
		quantity: number,
	): Promise<{ items: CartItemWithProductVariant[] }> => {
		const cartItems = getItems();
		const index = cartItems.findIndex((item) => item.variantId === variant.id);

		if (index > -1) {
			cartItems[index].quantity += quantity;
		} else {
			cartItems.push({
				quantity,
				variantId: variant.id,
				variant: { ...variant, product },
				cartId: "",
				id: "",
				createdAt: "" as any,
				updatedAt: "" as any,
			});
		}

		saveItems(cartItems);

		return {
			items: cartItems,
		};
	},

	updateItemQuantity: async (
		variantId: string,
		quantity: number,
	): Promise<{ items: CartItemWithProductVariant[] }> => {
		const cartItems = getItems();
		const index = cartItems.findIndex((item) => item.variantId === variantId);

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
		productVariantId: string,
	): Promise<{ items: CartItemWithProductVariant[] }> => {
		const cartItems = getItems().filter(
			(item) => item.variantId !== productVariantId,
		);
		saveItems(cartItems);
		return { items: cartItems };
	},
};
