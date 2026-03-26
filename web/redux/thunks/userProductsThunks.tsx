import { productsService } from "@redux/services/productsService";
import { usersService } from "@redux/services/usersService";
import { RootState } from "@redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ICreateProduct, IProduct, IUpdateProduct } from "@shared/interfaces";
import { ToastService } from "@shared/shadcn/hooks/use-toast";

export const getUserProductsAsync = createAsyncThunk(
	"userProducts/getUserProducts",
	async (_, { getState, rejectWithValue }) => {
		const state = getState() as RootState;

		try {
			return await usersService.getMeProducts(state.authReducer.token);
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const postUserProductAsync = createAsyncThunk(
	"cart/postUserProduct",
	async (
		{ data, toast }: { data: ICreateProduct; toast: ToastService },
		{ getState, rejectWithValue },
	) => {
		const state = getState() as RootState;

		try {
			const updatedCart = await productsService.post(
				state.authReducer.token,
				data,
			);

			toast({
				title: "Product listed",
				description: `"${data.name}" has been added successfully.`,
				duration: 3000,
			});

			return updatedCart;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const updateUserProductAsync = createAsyncThunk(
	"userProducts/updateUserProduct",
	async (
		{
			id,
			data,
			toast,
		}: { id: string; data: IUpdateProduct; toast?: ToastService },
		{ getState, rejectWithValue },
	) => {
		const state = getState() as RootState;

		try {
			const response = await productsService.update(
				state.authReducer.token,
				id,
				data,
			);

			toast &&
				toast({
					title: "Product updated",
					description: `"${data.name}" has been successfully updated.`,
					duration: 3000,
				});

			return response;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const removeUserProductAsync = createAsyncThunk(
	"userProducts/removeUserProduct",
	async (
		{ product, toast }: { product: IProduct; toast: ToastService },
		{ getState, rejectWithValue },
	) => {
		const state = getState() as RootState;

		try {
			const response = await productsService.remove(
				state.authReducer.token,
				product._id,
			);

			toast({
				title: "Product deleted",
				description: `"${product.name}" has been permanently removed.`,
				duration: 3000,
			});

			return response;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);
