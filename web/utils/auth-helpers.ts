import { toast } from "sonner";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { AppDispatch } from "@/redux/store";
import { getUserProductsAsync } from "@/redux/thunks/user-products-thunks";
import { getMeAsync, loginAsync } from "@/redux/thunks/auth-thunks";
import { getCartMeAsync } from "@/redux/thunks/cart-thunks";
import { getFavoritesAsync } from "@/redux/thunks/favorites-thunks";
import { setToken } from "@/redux/slices/auth-slice";
import { Locale, localizePath } from "@/lib/i18n";

export const handleLogin = async ({
	credentials,
	router,
	locale,
	dispatch,
}: {
	credentials: {
		email: string;
		password: string;
	};
	router: AppRouterInstance;
	dispatch: AppDispatch;
	locale: Locale;
}) => {
	await dispatch(loginAsync({ credentials, router, locale })).unwrap();
	await dispatch(getMeAsync());
	await dispatch(getCartMeAsync());
	await dispatch(getFavoritesAsync());
	await dispatch(getUserProductsAsync());
};

export const handleGoogleAuth = async ({
	token,
	dispatch,
	router,
	locale,
}: {
	token: string;
	dispatch: AppDispatch;
	router: AppRouterInstance;
	locale: Locale;
}) => {
	dispatch(setToken(token));

	await dispatch(getMeAsync()).unwrap();
	await dispatch(getCartMeAsync());
	await dispatch(getFavoritesAsync());
	await dispatch(getUserProductsAsync());

	toast("Welcome back!", { position: "top-center" });

	router.push(localizePath("/", locale));
};
