import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { getMeAsync, loginAsync, setToken } from "@/redux/slices/auth-slice";
import { getCartMeAsync } from "@/redux/slices/cart-slice";
import { getFavoritesAsync } from "@/redux/slices/favorites-slice";
import { getUserProductsAsync } from "@/redux/slices/user-products-slice";
import { useAppDispatch } from "@/redux/store";

import { useI18n } from "@/components/layout/i18n-provider";

import { localizePath } from "@/lib/i18n";

export function useAuth() {
	const dispatch = useAppDispatch();

	const router = useRouter();
	const { locale } = useI18n();

	const login = async (email: string, password: string) => {
		await dispatch(loginAsync({ email, password })).unwrap();

		toast("Welcome back!", { position: "top-center" });

		router.push(localizePath("/", locale));

		await dispatch(getMeAsync());
		await dispatch(getCartMeAsync());
		await dispatch(getFavoritesAsync());
		await dispatch(getUserProductsAsync());
	};

	const googleAuth = async (token: string) => {
		dispatch(setToken(token));

		await dispatch(getMeAsync()).unwrap();

		toast("Welcome back!", { position: "top-center" });

		router.push(localizePath("/", locale));

		await dispatch(getCartMeAsync());
		await dispatch(getFavoritesAsync());
		await dispatch(getUserProductsAsync());
	};

	return { login, googleAuth };
}
