import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { ProductEntity } from "@repo/types";

import {
	postFavoritesAsync,
	removeFavoritesAsync,
} from "@/redux/slices/favorites-slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";

export function useToggleFavorite(product: ProductEntity) {
	const router = useRouter();

	const dispatch = useAppDispatch();

	const { isAuthenticated } = useAppSelector((state) => state.auth);
	const { items } = useAppSelector((state) => state.favorites);

	const isFavorite = items.some((item) => item._id === product._id);

	const signin = () => {
		router.push("/signin");
	};

	const addToFavorites = async () => {
		if (isAuthenticated === false) {
			signin();
		} else {
			await dispatch(postFavoritesAsync(product._id)).unwrap();

			toast("Added to favorites.", { position: "top-center" });
		}
	};

	const removeFromFavorites = async () => {
		if (isAuthenticated === false) {
			signin();
		} else {
			await dispatch(removeFavoritesAsync(product._id)).unwrap();

			toast("Removed to favorites.", { position: "top-center" });
		}
	};

	return { isFavorite, addToFavorites, removeFromFavorites };
}
