import {
	createAsyncThunk,
	createSlice,
	SerializedError,
} from "@reduxjs/toolkit";

import { ProductEntity } from "@repo/types";

import { productsService } from "@/services/products-service";
import { usersService } from "@/services/users-service";

export type UserProductsState = {
	products: ProductEntity[];
	loading: boolean;
	error?: SerializedError;
};

const initialState: UserProductsState = {
	products: [],
	loading: false,
	error: undefined,
};

const getUserProductsAsync = createAsyncThunk(
	"userProducts/getUserProducts",
	usersService.getMeProducts,
);

const postUserProductAsync = createAsyncThunk(
	"userProducts/postUserProduct",
	productsService.post,
);

const updateUserProductAsync = createAsyncThunk(
	"userProducts/updateUserProduct",
	productsService.update,
);

const removeUserProductAsync = createAsyncThunk(
	"userProducts/removeUserProduct",
	productsService.remove,
);

const userProductsSlice = createSlice({
	name: "userProducts",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		// getUserProductsAsync
		builder
			.addCase(getUserProductsAsync.pending, (state) => {
				state.loading = true;
			})
			.addCase(getUserProductsAsync.fulfilled, (state, action) => {
				state.loading = false;
				state.products = action.payload;
			})
			.addCase(getUserProductsAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error;
			});

		// postUserProductAsync
		builder
			.addCase(postUserProductAsync.pending, (state) => {
				state.loading = true;
			})
			.addCase(postUserProductAsync.fulfilled, (state, action) => {
				state.loading = false;
				state.products = [...state.products, action.payload];
			})
			.addCase(postUserProductAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error;
			});

		// updateUserProductAsync
		builder
			.addCase(updateUserProductAsync.pending, (state) => {
				state.loading = true;
			})
			.addCase(updateUserProductAsync.fulfilled, (state, action) => {
				state.loading = false;
				state.products = [...state.products].map((item) =>
					item._id !== action.payload._id ? item : action.payload,
				);
			})
			.addCase(updateUserProductAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error;
			});

		// removeUserProductAsync
		builder
			.addCase(removeUserProductAsync.pending, (state) => {
				state.loading = true;
			})
			.addCase(removeUserProductAsync.fulfilled, (state, action) => {
				state.loading = false;
				state.products = state.products.filter(
					(item) => item._id !== action.meta.arg,
				);
			})
			.addCase(removeUserProductAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error;
			});
	},
});

export {
	getUserProductsAsync,
	postUserProductAsync,
	removeUserProductAsync,
	updateUserProductAsync,
};

export default userProductsSlice.reducer;
