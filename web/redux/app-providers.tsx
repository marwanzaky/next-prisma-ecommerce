"use client";

import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import {
	Persister,
	PersistQueryClientProvider,
} from "@tanstack/react-query-persist-client";

import { ReduxProvider } from "./provider";

const queryClient: QueryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5,
			gcTime: 1000 * 60 * 60 * 24,
		},
	},
});

const persister: Persister = createAsyncStoragePersister({
	storage: typeof window !== "undefined" ? window.localStorage : undefined,
});

export default function AppProviders({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<PersistQueryClientProvider
			client={queryClient}
			persistOptions={{ persister }}
		>
			<ReduxProvider>{children}</ReduxProvider>
		</PersistQueryClientProvider>
	);
}
