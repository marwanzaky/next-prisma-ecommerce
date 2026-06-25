import { ApiError } from "next/dist/server/api-utils";

import { createAsyncThunk, GetThunkAPI } from "@reduxjs/toolkit";

import { AppDispatch, RootState } from "@/redux/store";

import config from "./config";

export async function clientFetch<T>(
	endpoint: string,
	options: RequestInit = {},
): Promise<T> {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		...(options.headers as Record<string, string>),
	};

	if (options.body instanceof FormData) {
		delete headers["Content-Type"];
	}

	const response = await fetch(`${config.serverUrl}${endpoint}`, {
		...options,
		headers,
		credentials: "include",
	});

	if (!response.ok) {
		const error = await response.json();

		throw new ApiError(error.statusCode, error.message);
	}

	const contentType = response.headers.get("content-type");
	if (contentType && contentType.includes("application/json")) {
		return response.json();
	}

	return response.text() as Promise<T>;
}

type AppThunkConfig = {
	state: RootState;
	dispatch: AppDispatch;
	rejectValue: ApiError;
};

type AppThunkAPI = GetThunkAPI<AppThunkConfig>;

export const createAppThunk = <Returned, ThunkArg = void>(
	typePrefix: string,
	serviceMethod: (arg: ThunkArg, thunkAPI: AppThunkAPI) => Promise<Returned>,
) => {
	return createAsyncThunk.withTypes<AppThunkConfig>()<Returned, ThunkArg>(
		typePrefix,
		async (arg, thunkAPI) => {
			try {
				return await serviceMethod(arg, thunkAPI);
			} catch (error: unknown) {
				if (error instanceof ApiError) {
					return thunkAPI.rejectWithValue({
						name: error.name,
						statusCode: error.statusCode,
						message: error.message,
					});
				}

				if (error instanceof Error) {
					return thunkAPI.rejectWithValue({
						name: error.name,
						statusCode: 500,
						message: error.message,
					});
				}

				return thunkAPI.rejectWithValue({
					name: "Error",
					statusCode: 500,
					message: "An error occurred",
				});
			}
		},
	);
};
