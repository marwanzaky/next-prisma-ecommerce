import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@redux/store";
import {
	postFavoritesAsync,
	removeFavoritesAsync,
} from "@redux/thunks/favoritesThunks";
import { IProduct } from "_shared/interfaces";
import { useToast } from "_shared/shadcn/hooks/use-toast";

export function useToggleFavorite(product: IProduct) {
	const router = useRouter();

	const dispatch = useDispatch<AppDispatch>();

	const { toast } = useToast();
	const { isAuthenticated } = useAppSelector((state) => state.authReducer);
	const { items } = useAppSelector((state) => state.favoritesReducer);

	const isFavorite = items.some((item) => item._id === product._id);

	const signin = () => {
		router.push("/signin");
	};

	const addToFavorites = () => {
		if (isAuthenticated === false) {
			signin();
		} else {
			dispatch(postFavoritesAsync({ product, toast }));
		}
	};

	const removeFromFavorites = () => {
		if (isAuthenticated === false) {
			signin();
		} else {
			dispatch(removeFavoritesAsync({ product, toast }));
		}
	};

	return { isFavorite, addToFavorites, removeFromFavorites };
}
