import { createSlice, SerializedError } from "@reduxjs/toolkit";
import {
	CartItemWithProductVariant,
	Product,
	ProductVariant,
} from "@repo/database";

import { cartsService } from "@/services/carts-service";
import { guestCartService } from "@/services/guest-cart-service";

import { createAppThunk } from "@/lib/api-client";

import { selectIsAuthenticated } from "./auth-slice";

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
	selectIsAuthenticated(getState())
		? cartsService.getMe()
		: guestCartService.getMe(),
);

const postCartItemAsync = createAppThunk(
	"cart/postCartItem",
	(
		{
			product,
			variant,
			quantity,
		}: { product: Product; variant: ProductVariant; quantity: number },
		{ getState },
	) =>
		selectIsAuthenticated(getState())
			? cartsService.createCartItem(variant.id, quantity)
			: guestCartService.postItem(product, variant, quantity),
);

const updateCartItemQuantityAsync = createAppThunk(
	"cart/updateCartItemQuantity",
	(
		{ variantId, quantity }: { variantId: string; quantity: number },
		{ getState },
	) =>
		selectIsAuthenticated(getState())
			? cartsService.updateCartItemQuantity(variantId, quantity)
			: guestCartService.updateItemQuantity(variantId, quantity),
);

const deleteCartItemAsync = createAppThunk(
	"cart/deleteCartItem",
	(productVariantId: string, { getState }) =>
		selectIsAuthenticated(getState())
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
