import { RootState } from "@redux/store";
import { favoritesService } from "@redux/services/favoritesService";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { ToastService } from "@shared/shadcn/hooks/use-toast";
import { IProduct } from "@shared/interfaces";

export const getFavoritesAsync = createAsyncThunk(
	"favorites/getFavorites",
	async (_, { getState, rejectWithValue }) => {
		const state = getState() as RootState;

		try {
			return await favoritesService.getMe(state.authReducer.token);
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const postFavoritesAsync = createAsyncThunk(
	"favorites/postFavorites",
	async (
		{ product, toast }: { product: IProduct; toast: ToastService },
		{ getState, rejectWithValue },
	) => {
		const state = getState() as RootState;

		try {
			const response = await favoritesService.post(
				state.authReducer.token,
				product._id,
			);

			toast({
				title: "Added to favorites",
				description: `"${product.name}" is now in your favorites.`,
				duration: 3000,
			});

			return response;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const removeFavoritesAsync = createAsyncThunk(
	"favorites/removeFavorites",
	async (
		{ product, toast }: { product: IProduct; toast: ToastService },
		{ getState, rejectWithValue },
	) => {
		const state = getState() as RootState;

		try {
			const response = await favoritesService.remove(
				state.authReducer.token,
				product._id,
			);

			toast({
				title: "Removed to favorites",
				description: `"${product.name}" has been removed from your favorites.`,
				duration: 3000,
			});

			return response;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);
