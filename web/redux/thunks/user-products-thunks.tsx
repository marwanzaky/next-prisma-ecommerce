import { productsService } from "@redux/services/products-service";
import { usersService } from "@redux/services/users-service";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ICreateProduct, IProduct, IUpdateProduct } from "@shared/interfaces";
import { toast } from "sonner";

export const getUserProductsAsync = createAsyncThunk(
	"userProducts/getUserProducts",
	async (_, { rejectWithValue }) => {
		try {
			return await usersService.getMeProducts();
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const postUserProductAsync = createAsyncThunk(
	"cart/postUserProduct",
	async ({ data }: { data: ICreateProduct }, { rejectWithValue }) => {
		try {
			const updatedCart = await productsService.post(data);

			toast("Product added.", { position: "top-center" });

			return updatedCart;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const updateUserProductAsync = createAsyncThunk(
	"userProducts/updateUserProduct",
	async (
		{ id, data }: { id: string; data: IUpdateProduct },
		{ rejectWithValue },
	) => {
		try {
			const response = await productsService.update(id, data);

			toast && toast("Product updated.", { position: "top-center" });

			return response;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const removeUserProductAsync = createAsyncThunk(
	"userProducts/removeUserProduct",
	async ({ product }: { product: IProduct }, { rejectWithValue }) => {
		try {
			const response = await productsService.remove(product._id);

			toast("Product deleted.", { position: "top-center" });

			return response;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);
