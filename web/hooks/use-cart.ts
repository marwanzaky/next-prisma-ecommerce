import { toast } from "sonner";

import { ProductEntity } from "@repo/types";

import {
	deleteCartItemAsync,
	postCartItemAsync,
} from "@/redux/slices/cart-slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";

export function useCart() {
	const dispatch = useAppDispatch();

	const { isAuthenticated } = useAppSelector((state) => state.auth);

	const addToCart = async (product: ProductEntity, quantity: number = 1) => {
		await dispatch(postCartItemAsync({ product, quantity })).unwrap();

		if (isAuthenticated) {
			toast("Added to cart.", { position: "top-center" });
		} else {
			toast("Added to cart (guest).", { position: "top-center" });
		}
	};

	const removeFromCart = async (productId: string) => {
		await dispatch(deleteCartItemAsync(productId)).unwrap();

		if (isAuthenticated) {
			toast("Removed from cart.", { position: "top-center" });
		} else {
			toast("Removed from cart (guest).", { position: "top-center" });
		}
	};

	return { addToCart, removeFromCart };
}
