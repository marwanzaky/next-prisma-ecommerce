import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { ApiError } from "next/dist/server/api-utils";

import { persistReducer, persistStore } from "redux-persist";
import { toast } from "sonner";

import {
	configureStore,
	createListenerMiddleware,
	isRejected,
	Middleware,
} from "@reduxjs/toolkit";

import storage from "@/lib/storage-utils";

import authReducer, { AuthState, logoutAsync } from "./slices/auth-slice";
import cartReducer, { CartState } from "./slices/cart-slice";
import favoritesReducer, { FavoritesState } from "./slices/favorites-slice";
import userProductsReducer, {
	UserProductsState,
} from "./slices/user-products-slice";

const authPersistConfig = {
	key: "auth",
	storage,
};

const cartPersistConfig = {
	key: "cart",
	storage,
};

const favoritesPersistConfig = {
	key: "favorites",
	storage,
};

const userProductsPersistConfig = {
	key: "userProducts",
	storage,
};

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
	predicate: (action) => {
		if (!isRejected(action)) return false;

		const error = action.payload as ApiError | undefined;

		if (error?.statusCode === 401) return false;

		return true;
	},
	effect: (action) => {
		const error = action.payload as ApiError;
		toast.error("Uh oh! Something went wrong.", {
			description: error.message,
			position: "top-center",
		});
	},
});

export const authGuardMiddleware: Middleware =
	(store) => (next) => (action) => {
		if (isRejected(action)) {
			const payload = action.payload as ApiError;

			const isAuthenticated = !!(store.getState() as RootState).auth.user;

			if (payload.statusCode === 401 && isAuthenticated) {
				(store.dispatch as AppDispatch)(logoutAsync());

				window.location.href = "/signin";

				return;
			}
		}
		return next(action);
	};

export const store = configureStore({
	reducer: {
		auth: persistReducer<AuthState>(authPersistConfig, authReducer),
		cart: persistReducer<CartState>(cartPersistConfig, cartReducer),
		favorites: persistReducer<FavoritesState>(
			favoritesPersistConfig,
			favoritesReducer,
		),
		userProducts: persistReducer<UserProductsState>(
			userProductsPersistConfig,
			userProductsReducer,
		),
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
			},
		})
			.prepend(listenerMiddleware.middleware)
			.concat(authGuardMiddleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
