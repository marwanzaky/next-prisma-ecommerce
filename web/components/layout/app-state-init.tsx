"use client";

import { useEffect } from "react";

import { getMeAsync } from "@/redux/slices/auth-slice";
import { getCartMeAsync } from "@/redux/slices/cart-slice";
import { getFavoritesAsync } from "@/redux/slices/favorites-slice";
import { getUserProductsAsync } from "@/redux/slices/user-products-slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";

export default function AppStateInit() {
	const dispatch = useAppDispatch();

	const { isAuthenticated } = useAppSelector((state) => state.auth);

	useEffect(() => {
		if (isAuthenticated === true) {
			dispatch(getMeAsync());
			dispatch(getCartMeAsync());
			dispatch(getFavoritesAsync());
			dispatch(getUserProductsAsync());
		}
	}, [isAuthenticated, dispatch]);

	return null;
}
