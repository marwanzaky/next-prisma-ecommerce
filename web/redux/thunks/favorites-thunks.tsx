import { toast } from "sonner";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { favoritesService } from "@/redux/services/favorites-service";

import { IProduct } from "@/types/product.type";

export const getFavoritesAsync = createAsyncThunk(
	"favorites/getFavorites",
	async (_, { rejectWithValue }) => {
		try {
			return await favoritesService.getMe();
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const postFavoritesAsync = createAsyncThunk(
	"favorites/postFavorites",
	async ({ product }: { product: IProduct }, { rejectWithValue }) => {
		try {
			const response = await favoritesService.post(product._id);

			toast("Added to favorites.", { position: "top-center" });

			return response;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const removeFavoritesAsync = createAsyncThunk(
	"favorites/removeFavorites",
	async ({ product }: { product: IProduct }, { rejectWithValue }) => {
		try {
			const response = await favoritesService.remove(product._id);

			toast("Removed to favorites.", { position: "top-center" });

			return response;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);
