import {
	createAsyncThunk,
	createSlice,
	SerializedError,
} from "@reduxjs/toolkit";
import { ProductTranslatedText } from "@repo/database";

import { productsService } from "@/services/products-service";
import { usersService } from "@/services/users-service";

export type UserProductsState = {
	products: ProductTranslatedText[];
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

const createUserProductAsync = createAsyncThunk(
	"userProducts/createUserProduct",
	productsService.createProduct,
);

const updateUserProductAsync = createAsyncThunk(
	"userProducts/updateUserProduct",
	productsService.updateProduct,
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

		// createUserProductAsync
		builder
			.addCase(createUserProductAsync.pending, (state) => {
				state.loading = true;
			})
			.addCase(createUserProductAsync.fulfilled, (state, action) => {
				state.loading = false;
				state.products = [...state.products, action.payload];
			})
			.addCase(createUserProductAsync.rejected, (state, action) => {
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
				state.products = state.products.map((item) =>
					item.id !== action.payload.id ? item : action.payload,
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
					(item) => item.id !== action.meta.arg,
				);
			})
			.addCase(removeUserProductAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error;
			});
	},
});

export {
	createUserProductAsync,
	getUserProductsAsync,
	removeUserProductAsync,
	updateUserProductAsync,
};

export default userProductsSlice.reducer;
