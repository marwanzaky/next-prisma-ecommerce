import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { toast } from "sonner";

import { createAsyncThunk } from "@reduxjs/toolkit";

import { usersService } from "@/redux/services/users-service";

import { UpdateUser, UpdateUserPassword } from "@/shared/types/user.type";

import { Locale, localizePath } from "@/lib/i18n";

export const loginAsync = createAsyncThunk(
	"auth/login",
	async (
		{
			credentials,
			router,
			locale,
		}: {
			credentials: {
				email: string;
				password: string;
			};
			router: AppRouterInstance;
			locale: Locale;
		},
		{ rejectWithValue },
	) => {
		const { email, password } = credentials;

		try {
			const data = await usersService.login(email, password);

			toast("Welcome back!", { position: "top-center" });

			router.push(localizePath("/", locale));
			return data;
		} catch (error: any) {
			toast.error("Sign-in failed.", {
				description: error.message,
				position: "top-center",
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
		},
		{ rejectWithValue },
	) => {
		const { name, email, password } = credentials;

		try {
			const data = await usersService.signup(name, email, password);

			toast("Account created successfully!");

			return data;
		} catch (error: any) {
			toast.error("Uh oh! Something went wrong.", {
				description: error.message,
				position: "top-center",
			});

			return rejectWithValue(error.message);
		}
	},
);

export const getMeAsync = createAsyncThunk(
	"auth/getMe",
	async (_, { rejectWithValue }) => {
		try {
			return await usersService.getMe();
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const updateMeAsync = createAsyncThunk(
	"auth/updateMe",
	async (
		updatedUser: UpdateUser & { photoFile?: File },
		{ rejectWithValue },
	) => {
		try {
			const data = await usersService.updateMe(updatedUser);

			toast("User settings updated successfully!", { position: "top-center" });

			return data;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);

export const updateMyPasswordAsync = createAsyncThunk(
	"auth/updateMyPassword",
	async (updatedUserPassword: UpdateUserPassword, { rejectWithValue }) => {
		try {
			const data = await usersService.updateMyPassword(updatedUserPassword);

			toast("User password updated successfully!", { position: "top-center" });

			return data;
		} catch (error: any) {
			toast.error("Uh oh! Something went wrong.", {
				description: error.message,
				position: "top-center",
			});

			return rejectWithValue(error.message);
		}
	},
);

export const deleteMeAsync = createAsyncThunk(
	"auth/deleteMe",
	async (_, { rejectWithValue }) => {
		try {
			const data = await usersService.deleteMe();

			toast("User deleted successfully!", { position: "top-center" });

			return data;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	},
);
