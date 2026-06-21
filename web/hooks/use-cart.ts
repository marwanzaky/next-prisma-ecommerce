import { useState } from "react";

import { toast } from "sonner";

import { Product, ProductVariant } from "@repo/database";

import { selectIsAuthenticated } from "@/redux/slices/auth-slice";
import {
	deleteCartItemAsync,
	postCartItemAsync,
} from "@/redux/slices/cart-slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";

export function useCart() {
	const dispatch = useAppDispatch();

	const isAuthenticated = useAppSelector(selectIsAuthenticated);

	const [addToCartLoading, setAddToCartLoading] = useState(false);

	const addToCart = async (
		product: Product,
		variant: ProductVariant,
		quantity: number = 1,
	) => {
		setAddToCartLoading(true);

		await dispatch(postCartItemAsync({ product, variant, quantity })).unwrap();

		setAddToCartLoading(false);

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

	return { addToCart, addToCartLoading, removeFromCart };
}
