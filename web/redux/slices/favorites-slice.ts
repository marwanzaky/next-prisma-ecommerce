import {
	createAsyncThunk,
	createSlice,
	SerializedError,
} from "@reduxjs/toolkit";

import { ProductEntity } from "@repo/types";

import { favoritesService } from "@/services/favorites-service";

export type FavoritesState = {
	items: ProductEntity[];

	loading: boolean;
	error?: SerializedError;
};

const initialState: FavoritesState = {
	items: [],

	loading: false,
	error: undefined,
};

const getFavoritesAsync = createAsyncThunk(
	"favorites/getFavorites",
	favoritesService.getMe,
);

const postFavoritesAsync = createAsyncThunk(
	"favorites/postFavorites",
	favoritesService.post,
);

const removeFavoritesAsync = createAsyncThunk(
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
				state.items = state.items.filter(
					(item) => item._id !== action.meta.arg,
				);
			})
			.addCase(removeFavoritesAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error;
			});
	},
});

export { getFavoritesAsync, postFavoritesAsync, removeFavoritesAsync };

export default favoritesSlice.reducer;
