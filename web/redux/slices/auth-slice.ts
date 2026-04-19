import { createSlice } from "@reduxjs/toolkit";

import { User } from "@/shared/types/user.type";

import {
	getMeAsync,
	loginAsync,
	signupAsync,
	updateMeAsync,
	updateMyPasswordAsync,
} from "@/redux/thunks/auth-thunks";
import Cookies from "js-cookie";

export type AuthState = {
	user: User | null;
	isAuthenticated: boolean;

	loading: boolean;
	error: string | null;
};

const initialState: AuthState = {
	user: null,
	isAuthenticated: false,

	loading: false,
	error: null,
};

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
				state.error = null;
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
				state.error = action.payload as string;
			});
		// signupAsync
		builder
			.addCase(signupAsync.pending, (state) => {
				state.loading = true;
				state.error = null;
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
				state.error = action.payload as string;
			});
		// getMeAsync
		builder
			.addCase(getMeAsync.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(getMeAsync.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload;
			})
			.addCase(getMeAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
		// updateMeAsync
		builder
			.addCase(updateMeAsync.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateMeAsync.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload;
			})
			.addCase(updateMeAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
		// updateMyPasswordAsync
		builder
			.addCase(updateMyPasswordAsync.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateMyPasswordAsync.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(updateMyPasswordAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
	},
});

export const { setToken, logOut } = authSlice.actions;

export default authSlice.reducer;
