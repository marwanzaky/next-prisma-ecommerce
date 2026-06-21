import { createSlice, SerializedError } from "@reduxjs/toolkit";
import { PublicUser } from "@repo/database";

import { authService } from "@/services/auth-service";
import { usersService } from "@/services/users-service";

import { createAppThunk } from "@/lib/api-client";

import { RootState } from "../store";

export type AuthState = {
	user: PublicUser | null;

	loading: boolean;
	error?: SerializedError;
};

const initialState: AuthState = {
	user: null,

	loading: false,
	error: undefined,
};

const loginAsync = createAppThunk("auth/login", authService.login);

const signupAsync = createAppThunk("auth/signup", authService.signup);

const logoutAsync = createAppThunk("auth/logout", authService.logout);

const resetPasswordAsync = createAppThunk(
	"auth/resetPassword",
	authService.resetPassword,
);

const forgotPasswordAsync = createAppThunk(
	"auth/forgotPassword",
	authService.forgotPassword,
);

const getMeAsync = createAppThunk("auth/getMe", usersService.getMe);

const updateMeAsync = createAppThunk("auth/updateMe", usersService.updateMe);

const updateMyPasswordAsync = createAppThunk(
	"auth/updateMyPassword",
	usersService.updateMyPassword,
);

const deleteMeAsync = createAppThunk("auth/deleteMe", usersService.deleteMe);

export const selectIsAuthenticated = (state: RootState) => !!state.auth.user;

export const authSlice = createSlice({
	name: "auth",
	initialState: initialState,
	reducers: {},
	extraReducers: (builder) => {
		// loginAsync
		builder
			.addCase(loginAsync.pending, (state) => {
				state.loading = true;
			})
			.addCase(loginAsync.fulfilled, (state) => {
				state.loading = false;
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
			.addCase(signupAsync.fulfilled, (state) => {
				state.loading = false;
			})
			.addCase(signupAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error;
			});
		// logoutAsync
		builder
			.addCase(logoutAsync.pending, (state) => {
				state.loading = true;
			})
			.addCase(logoutAsync.fulfilled, () => {
				return initialState;
			})
			.addCase(logoutAsync.rejected, (state, action) => {
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
				return initialState;
			})
			.addCase(deleteMeAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error;
			});
	},
});

export {
	deleteMeAsync,
	forgotPasswordAsync,
	getMeAsync,
	loginAsync,
	logoutAsync,
	resetPasswordAsync,
	signupAsync,
	updateMeAsync,
	updateMyPasswordAsync,
};

export default authSlice.reducer;
