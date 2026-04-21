"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { AppDispatch, useAppSelector } from "@/redux/store";
import { getMeAsync } from "@/redux/thunks/auth-thunks";
import { getCartMeAsync } from "@/redux/thunks/cart-thunks";
import { getFavoritesAsync } from "@/redux/thunks/favorites-thunks";
import { getUserProductsAsync } from "@/redux/thunks/user-products-thunks";

export default function AppStateInit() {
	const dispatch = useDispatch<AppDispatch>();

	const { isAuthenticated } = useAppSelector((state) => state.authReducer);

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
