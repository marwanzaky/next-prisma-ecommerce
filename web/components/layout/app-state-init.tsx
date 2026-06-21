"use client";

import { useEffect } from "react";

import { getMeAsync } from "@/redux/slices/auth-slice";
import { getCartMeAsync } from "@/redux/slices/cart-slice";
import { getFavoritesAsync } from "@/redux/slices/favorites-slice";
import { getUserProductsAsync } from "@/redux/slices/user-products-slice";
import { useAppDispatch } from "@/redux/store";

export default function AppStateInit() {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(getMeAsync())
			.unwrap()
			.then(() => {
				dispatch(getCartMeAsync());
				dispatch(getFavoritesAsync());
				dispatch(getUserProductsAsync());
			})
			.catch(() => {});
	}, [dispatch]);

	return null;
}
