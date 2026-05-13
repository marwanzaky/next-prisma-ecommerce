import Cookies from "js-cookie";

import {
	createAsyncThunk,
	createSlice,
	SerializedError,
} from "@reduxjs/toolkit";

import { User } from "@repo/types";

import { authService } from "@/services/auth-service";
import { usersService } from "@/services/users-service";

export type AuthState = {
	user: User | null;
	isAuthenticated: boolean;

	loading: boolean;
	error?: SerializedError;
};

const initialState: AuthState = {
	user: null,
	isAuthenticated: false,

	loading: false,
	error: undefined,
};

const loginAsync = createAsyncThunk("auth/login", authService.login);

const signupAsync = createAsyncThunk("auth/signup", authService.signup);

const resetPasswordAsync = createAsyncThunk(
	"auth/resetPassword",
	authService.resetPassword,
);

const forgotPasswordAsync = createAsyncThunk(
	"auth/forgotPassword",
	authService.forgotPassword,
);

const getMeAsync = createAsyncThunk("auth/getMe", usersService.getMe);

const updateMeAsync = createAsyncThunk("auth/updateMe", usersService.updateMe);

const updateMyPasswordAsync = createAsyncThunk(
	"auth/updateMyPassword",
	usersService.updateMyPassword,
);

const deleteMeAsync = createAsyncThunk("auth/deleteMe", usersService.deleteMe);

export const authSlice = createSlice({
	name: "auth",
	initialState: initialState,
	reducers: {
		setToken: (state, action: { payload: string }) => {
			state.isAuthenticated = true;

			Cookies.set("token", action.payload, {
				expires: 14,
				secure: true,
				sameSite: "strict",
			});
		},
		logOut: (): AuthState => {
			Cookies.remove("token");
			return initialState;
		},
	},
	extraReducers: (builder) => {
		// loginAsync
		builder
			.addCase(loginAsync.pending, (state) => {
				state.loading = true;
			})
			.addCase(loginAsync.fulfilled, (state, action) => {
				state.loading = false;
				state.isAuthenticated = true;

				Cookies.set("token", action.payload.token, {
					expires: 14,
					secure: true,
					sameSite: "strict",
				});
			})
			.addCase(loginAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error;
			});
		// signupAsync
		builder
			.addCase(signupAsync.pending, (state) => {
				state.loading = true;
			})
			.addCase(signupAsync.fulfilled, (state, action) => {
				state.loading = false;
				state.isAuthenticated = true;

				Cookies.set("token", action.payload.token, {
					expires: 14,
					secure: true,
					sameSite: "strict",
				});
			})
			.addCase(signupAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error;
			});
		// resetPasswordAsync
		builder
			.addCase(resetPasswordAsync.pending, (state) => {
				state.loading = true;
			})
			.addCase(resetPasswordAsync.fulfilled, (state, action) => {
				state.loading = false;
				state.isAuthenticated = true;

				Cookies.set("token", action.payload.token, {
					expires: 14,
					secure: true,
					sameSite: "strict",
				});
			})
			.addCase(resetPasswordAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error;
			});
		// getMeAsync
		builder
			.addCase(getMeAsync.pending, (state) => {
				state.loading = true;
			})
			.addCase(getMeAsync.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload;
			})
			.addCase(getMeAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error;
			});
		// updateMeAsync
		builder
			.addCase(updateMeAsync.pending, (state) => {
				state.loading = true;
			})
			.addCase(updateMeAsync.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload;
			})
			.addCase(updateMeAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error;
			});
		// updateMyPasswordAsync
		builder
			.addCase(updateMyPasswordAsync.pending, (state) => {
				state.loading = true;
			})
			.addCase(updateMyPasswordAsync.fulfilled, (state, action) => {
				state.loading = false;

				Cookies.set("token", action.payload.token, {
					expires: 14,
					secure: true,
					sameSite: "strict",
				});
			})
			.addCase(updateMyPasswordAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error;
			});
		// deleteMeAsync
		builder
			.addCase(deleteMeAsync.pending, (state) => {
				state.loading = true;
			})
			.addCase(deleteMeAsync.fulfilled, () => {
				Cookies.remove("token");
				return initialState;
			})
			.addCase(deleteMeAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error;
			});
	},
});

export const { setToken, logOut } = authSlice.actions;

export {
	deleteMeAsync,
	forgotPasswordAsync,
	getMeAsync,
	loginAsync,
	resetPasswordAsync,
	signupAsync,
	updateMeAsync,
	updateMyPasswordAsync,
};

export default authSlice.reducer;
