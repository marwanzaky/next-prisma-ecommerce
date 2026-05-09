import {
	createAsyncThunk,
	createSlice,
	SerializedError,
} from "@reduxjs/toolkit";

import { CartItemEntity, ProductEntity } from "@repo/types";

import { cartsService } from "@/services/carts-service";
import { guestCartService } from "@/services/guest-cart-service";

import { RootState } from "../store";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
	state: RootState;
}>();

export type CartState = {
	items: CartItemEntity[];

	loading: boolean;
	error?: SerializedError;
};

const initialState: CartState = {
	items: [],

	loading: false,
	error: undefined,
};

const getCartMeAsync = createAppAsyncThunk(
	"cart/getCartMe",
	(_, { getState }) =>
		getState().auth.isAuthenticated
			? cartsService.getMe()
			: guestCartService.getMe(),
);

const postCartItemAsync = createAppAsyncThunk(
	"cart/postCartItem",
	(
		{ product, quantity }: { product: ProductEntity; quantity: number },
		{ getState },
	) =>
		getState().auth.isAuthenticated
			? cartsService.postItem(product._id, quantity)
			: guestCartService.postItem(product, quantity),
);

const updateCartItemQuantityAsync = createAppAsyncThunk(
	"cart/updateCartItemQuantity",
	(
		{ productId, quantity }: { productId: string; quantity: number },
		{ getState },
	) =>
		getState().auth.isAuthenticated
			? cartsService.updateItemQuantity(productId, quantity)
			: guestCartService.updateItemQuantity(productId, quantity),
);

const deleteCartItemAsync = createAppAsyncThunk(
	"cart/deleteCartItem",
	(productId: string, { getState }) =>
		getState().auth.isAuthenticated
			? cartsService.deleteItem(productId)
			: guestCartService.deleteItem(productId),
);

export const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		// getCartMeAsync
		builder
			.addCase(getCartMeAsync.pending, (state) => {
				state.loading = true;
			})
			.addCase(getCartMeAsync.fulfilled, (state, action) => {
				state.loading = false;
				state.items = action.payload.items;
			})
			.addCase(getCartMeAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error;
			});

		// postCartItemAsync
		builder
			.addCase(postCartItemAsync.pending, (state) => {
				state.loading = true;
			})
			.addCase(postCartItemAsync.fulfilled, (state, action) => {
				state.loading = false;
				state.items = action.payload.items;
			})
			.addCase(postCartItemAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error;
			});

		// updateCartItemQuantityAsync
		builder
			.addCase(updateCartItemQuantityAsync.pending, (state) => {
				state.loading = true;
			})
			.addCase(updateCartItemQuantityAsync.fulfilled, (state, action) => {
				state.loading = false;
				state.items = action.payload.items;
			})
			.addCase(updateCartItemQuantityAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error;
			});

		// deleteCartItemAsync
		builder
			.addCase(deleteCartItemAsync.pending, (state) => {
				state.loading = true;
			})
			.addCase(deleteCartItemAsync.fulfilled, (state, action) => {
				state.loading = false;
				state.items = action.payload.items;
			})
			.addCase(deleteCartItemAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error;
			});
	},
});

export {
	deleteCartItemAsync,
	getCartMeAsync,
	postCartItemAsync,
	updateCartItemQuantityAsync,
};

export default cartSlice.reducer;
