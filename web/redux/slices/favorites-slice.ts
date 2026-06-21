import { createSlice, SerializedError } from "@reduxjs/toolkit";
import { ProductWithVariantsReviewsUser } from "@repo/database";

import { favoritesService } from "@/services/favorites-service";

import { createAppThunk } from "@/lib/api-client";

export type FavoritesState = {
	items: ProductWithVariantsReviewsUser[];

	loading: boolean;
	error?: SerializedError;
};

const initialState: FavoritesState = {
	items: [],

	loading: false,
	error: undefined,
};

const getFavoritesAsync = createAppThunk(
	"favorites/getFavorites",
	favoritesService.getMe,
);

const postFavoritesAsync = createAppThunk(
	"favorites/postFavorites",
	favoritesService.post,
);

const removeFavoritesAsync = createAppThunk(
	"favorites/removeFavorites",
	favoritesService.remove,
);

export const favoritesSlice = createSlice({
	name: "favorites",
	initialState: initialState,
	reducers: {},
	extraReducers: (builder) => {
		// getFavoritesAsync
		builder
			.addCase(getFavoritesAsync.pending, (state) => {
				state.loading = true;
			})
			.addCase(getFavoritesAsync.fulfilled, (state, action) => {
				state.loading = false;
				state.items = action.payload;
			})
			.addCase(getFavoritesAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error;
			});

		// postFavoritesAsync
		builder
			.addCase(postFavoritesAsync.pending, (state) => {
				state.loading = true;
			})
			.addCase(postFavoritesAsync.fulfilled, (state, action) => {
				state.loading = false;
				state.items = [...state.items, action.payload];
			})
			.addCase(postFavoritesAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error;
			});

		// removeFavoritesAsync
		builder
			.addCase(removeFavoritesAsync.pending, (state) => {
				state.loading = true;
			})
			.addCase(removeFavoritesAsync.fulfilled, (state, action) => {
				state.loading = false;
				state.items = state.items.filter((item) => item.id !== action.meta.arg);
			})
			.addCase(removeFavoritesAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error;
			});
	},
});

export { getFavoritesAsync, postFavoritesAsync, removeFavoritesAsync };

export default favoritesSlice.reducer;
