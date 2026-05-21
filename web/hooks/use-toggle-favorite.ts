import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { Product } from "@repo/database";

import {
	postFavoritesAsync,
	removeFavoritesAsync,
} from "@/redux/slices/favorites-slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";

export function useToggleFavorite(product: Product) {
	const router = useRouter();

	const dispatch = useAppDispatch();

	const { isAuthenticated } = useAppSelector((state) => state.auth);
	const { items } = useAppSelector((state) => state.favorites);

	const isFavorite = items.some((item) => item.id === product.id);

	const signin = () => {
		router.push("/signin");
	};

	const addToFavorites = async () => {
		if (isAuthenticated === false) {
			signin();
		} else {
			await dispatch(postFavoritesAsync(product.id)).unwrap();

			toast("Added to favorites.", { position: "top-center" });
		}
	};

	const removeFromFavorites = async () => {
		if (isAuthenticated === false) {
			signin();
		} else {
			await dispatch(removeFavoritesAsync(product.id)).unwrap();

			toast("Removed to favorites.", { position: "top-center" });
		}
	};

	return { isFavorite, addToFavorites, removeFromFavorites };
}
