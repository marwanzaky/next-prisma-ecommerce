import { cartsService } from "@redux/services/cartsService";
import { guestCartService } from "@redux/services/guestCartService";
import { RootState } from "@redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IProduct } from "@shared/interfaces";
import { ToastService } from "@shared/shadcn/hooks/use-toast";

export const getCartMeAsync = createAsyncThunk(
	"cart/getCartMe",
	async (_, { getState, rejectWithValue }) => {
		const state = getState() as RootState;
		const isAuthenticated = state.authReducer.isAuthenticated;

		try {
			if (isAuthenticated === false) {
				return await guestCartService.getMe();
			}

			return await cartsService.getMe(state.authReducer.token);
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const postCartItemAsync = createAsyncThunk(
	"cart/postCartItem",
	async (
		{
			product,
			toast,
			quantity = 1,
		}: { product: IProduct; toast: ToastService; quantity?: number },
		{ getState, rejectWithValue },
	) => {
		const state = getState() as RootState;
		const isAuthenticated = state.authReducer.isAuthenticated;

		try {
			if (isAuthenticated === false) {
				const updatedCart = await guestCartService.postItem(product, quantity);

				toast({
					title: "Added to cart (guest)",
					description: `"${product.name}" has been added to your cart.`,
					duration: 3000,
				});

				return updatedCart;
			}

			const updatedCart = await cartsService.postItem(
				state.authReducer.token,
				product._id,
				quantity,
			);

			toast({
				title: "Added to cart",
				description: `"${product.name}" has been added to your cart.`,
				duration: 3000,
			});

			return updatedCart;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const updateCartItemQuantityAsync = createAsyncThunk(
	"cart/updateCartItemQuantity",
	async (
		{ productId, quantity }: { productId: string; quantity: number },
		{ getState, rejectWithValue },
	) => {
		const state = getState() as RootState;
		const isAuthenticated = state.authReducer.isAuthenticated;

		try {
			if (isAuthenticated === false) {
				return await guestCartService.updateItemQuantity(productId, quantity);
			}

			return await cartsService.updateItemQuantity(
				state.authReducer.token,
				productId,
				quantity,
			);
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const deleteCartItemAsync = createAsyncThunk(
	"cart/deleteCartItem",
	async (
		{ product, toast }: { product: IProduct; toast: ToastService },
		{ getState, rejectWithValue },
	) => {
		const state = getState() as RootState;
		const isAuthenticated = state.authReducer.isAuthenticated;

		try {
			if (isAuthenticated === false) {
				const updatedCart = await guestCartService.deleteItem(product._id);

				toast({
					title: "Removed from cart (guest)",
					description: `"${product.name}" has been removed from your cart.`,
					duration: 3000,
				});

				return updatedCart;
			}

			const updatedCart = await cartsService.deleteItem(
				state.authReducer.token,
				product._id,
			);

			toast({
				title: "Removed from cart",
				description: `"${product.name}" has been removed from your cart.`,
				duration: 3000,
			});

			return updatedCart;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);
