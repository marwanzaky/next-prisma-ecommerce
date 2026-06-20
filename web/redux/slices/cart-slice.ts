import { createSlice, SerializedError } from "@reduxjs/toolkit";
import { CartItemWithProductVariant, ProductVariant } from "@repo/database";

import { cartsService } from "@/services/carts-service";
import { guestCartService } from "@/services/guest-cart-service";

import { createAppThunk } from "@/lib/api-client";

export type CartState = {
	items: CartItemWithProductVariant[];

	loading: boolean;
	error?: SerializedError;
};

const initialState: CartState = {
	items: [],

	loading: false,
	error: undefined,
};

const getCartMeAsync = createAppThunk("cart/getCartMe", (_, { getState }) =>
	getState().auth.isAuthenticated
		? cartsService.getMe()
		: guestCartService.getMe(),
);

const postCartItemAsync = createAppThunk(
	"cart/postCartItem",
	(
		{
			productVariant,
			quantity,
		}: { productVariant: ProductVariant; quantity: number },
		{ getState },
	) =>
		getState().auth.isAuthenticated
			? cartsService.createCartItem(productVariant.id, quantity)
			: guestCartService.postItem(productVariant, quantity),
);

const updateCartItemQuantityAsync = createAppThunk(
	"cart/updateCartItemQuantity",
	(
		{ productId, quantity }: { productId: string; quantity: number },
		{ getState },
	) =>
		getState().auth.isAuthenticated
			? cartsService.updateCartItemQuantity(productId, quantity)
			: guestCartService.updateItemQuantity(productId, quantity),
);

const deleteCartItemAsync = createAppThunk(
	"cart/deleteCartItem",
	(productVariantId: string, { getState }) =>
		getState().auth.isAuthenticated
			? cartsService.deleteCartItem(productVariantId)
			: guestCartService.deleteItem(productVariantId),
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
