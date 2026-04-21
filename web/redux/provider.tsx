"use client";

import { Provider } from "react-redux";

import { PersistGate } from "redux-persist/integration/react";

import { persistor, store } from "./store";

export function ReduxProvider(props: { children: React.ReactNode }) {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				{props.children}
			</PersistGate>
		</Provider>
	);
}
