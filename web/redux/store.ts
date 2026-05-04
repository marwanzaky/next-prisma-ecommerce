import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { persistReducer, persistStore } from "redux-persist";
import { toast } from "sonner";

import {
	configureStore,
	createListenerMiddleware,
	isRejected,
} from "@reduxjs/toolkit";

import storage from "@/lib/storage-utils";

import authReducer, { AuthState } from "./slices/auth-slice";
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

const userProductsPersistConfig = {
	key: "userProducts",
	storage,
};

const favoritesPersistConfig = {
	key: "userProducts",
	storage,
};

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
	predicate: isRejected,
	effect: (action) => {
		toast.error("Uh oh! Something went wrong.", {
			description: action.error?.message || "Something went wrong",
			position: "top-center",
		});
	},
});

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
		}).prepend(listenerMiddleware.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
