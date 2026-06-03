import { toast } from "sonner";

import { ProductVariant } from "@repo/database";

import {
	deleteCartItemAsync,
	postCartItemAsync,
} from "@/redux/slices/cart-slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";

export function useCart() {
	const dispatch = useAppDispatch();

	const { isAuthenticated } = useAppSelector((state) => state.auth);

	const addToCart = async (
		productVariant: ProductVariant,
		quantity: number = 1,
	) => {
		await dispatch(postCartItemAsync({ productVariant, quantity })).unwrap();

		if (isAuthenticated) {
			toast("Added to cart.", { position: "top-center" });
		} else {
			toast("Added to cart (guest).", { position: "top-center" });
		}
	};

	const removeFromCart = async (productVariantId: string) => {
		await dispatch(deleteCartItemAsync(productVariantId)).unwrap();

		if (isAuthenticated) {
			toast("Removed from cart.", { position: "top-center" });
		} else {
			toast("Removed from cart (guest).", { position: "top-center" });
		}
	};

	return { addToCart, removeFromCart };
}
