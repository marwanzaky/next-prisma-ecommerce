import { usersService } from "@redux/services/usersService";
import { RootState } from "@redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IUpdateUser } from "_shared/interfaces";
import { toast, ToastService } from "_shared/shadcn/hooks/use-toast";
import { ToastAction } from "_shared/shadcn/toast";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const loginAsync = createAsyncThunk(
	"auth/login",
	async (
		credentials: {
			email: string;
			password: string;
			router: AppRouterInstance;
			toast: ToastService;
		},
		{ rejectWithValue },
	) => {
		const { email, password, router, toast } = credentials;

		try {
			const data = await usersService.login(email, password);

			toast({
				title: "Welcome back!",
				description: "You've successfully signed in.",
				duration: 3000,
			});

			router.push("/");
			return data;
		} catch (error: any) {
			toast({
				title: "Sign-in failed",
				description: error.message,
				variant: "destructive",
				duration: 3000,
			});

			return rejectWithValue(error.message);
		}
	},
);

export const signupAsync = createAsyncThunk(
	"auth/signup",
	async (
		credentials: {
			name: string;
			email: string;
			password: string;
			router: AppRouterInstance;
		},
		{ rejectWithValue },
	) => {
		const { name, email, password, router } = credentials;

		try {
			const data = await usersService.signup(name, email, password);

			toast({
				title: "Account created successfully!",
				duration: 3000,
			});

			router.push("/signin");
			return data;
		} catch (error: any) {
			toast({
				title: "Uh oh! Something went wrong.",
				description: error.message,
				duration: 3000,
				variant: "destructive",
				action: <ToastAction altText="Try again">Try again</ToastAction>,
			});

			return rejectWithValue(error.message);
		}
	},
);

export const getMeAsync = createAsyncThunk(
	"auth/getMe",
	async (_, { getState, rejectWithValue }) => {
		const state = getState() as RootState;

		try {
			return await usersService.getMe(state.authReducer.token);
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const updateMeAsync = createAsyncThunk(
	"auth/updateMe",
	async (updatedUser: IUpdateUser, { getState, rejectWithValue }) => {
		const state = getState() as RootState;

		try {
			const data = await usersService.updateMe(
				state.authReducer.token,
				updatedUser,
			);

			toast({
				title: "User settings updated successfully!",
				duration: 3000,
			});

			return data;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const updateMyPasswordAsync = createAsyncThunk(
	"auth/updateMyPassword",
	async (
		payload: { currentPassword: string; newPassword: string },
		{ getState, rejectWithValue },
	) => {
		const state = getState() as RootState;

		try {
			const data = await usersService.updateMyPassword(
				state.authReducer.token,
				payload,
			);

			toast({
				title: "User password updated successfully!",
				duration: 3000,
			});

			return data;
		} catch (error: any) {
			toast({
				title: "Uh oh! Something went wrong.",
				description: error.message,
				duration: 3000,
				variant: "destructive",
				action: <ToastAction altText="Try again">Try again</ToastAction>,
			});

			return rejectWithValue(error.message);
		}
	},
);
