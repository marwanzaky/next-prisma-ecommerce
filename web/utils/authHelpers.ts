import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { AppDispatch } from "../redux/store";

import { getUserProductsAsync } from "@redux/thunks/userProductsThunks";
import { getMeAsync, loginAsync } from "@redux/thunks/authThunks";
import { getCartMeAsync } from "@redux/thunks/cartThunks";
import { getFavoritesAsync } from "@redux/thunks/favoritesThunks";
import { ToastService } from "_shared/shadcn/hooks/use-toast";

export const handleLogin = async (
	email: string,
	password: string,
	dispatch: AppDispatch,
	router: AppRouterInstance,
	toast: ToastService,
) => {
	await dispatch(loginAsync({ email, password, router, toast })).unwrap();
	await dispatch(getMeAsync());
	await dispatch(getCartMeAsync());
	await dispatch(getFavoritesAsync());
	await dispatch(getUserProductsAsync());
};
