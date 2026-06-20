import Cookies from "js-cookie";

import config from "./config";
import { createAsyncThunk, GetThunkAPI } from "@reduxjs/toolkit";
import { ApiError } from "next/dist/server/api-utils";
import { AppDispatch, RootState } from "@/redux/store";

export async function clientFetch<T>(
	endpoint: string,
	options: RequestInit = {},
): Promise<T> {
	const token = Cookies.get("token");

	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		...(token && { Authorization: `Bearer ${token}` }),
		...(options.headers as Record<string, string>),
	};

	if (options.body instanceof FormData) {
		delete headers["Content-Type"];
	}

	const response = await fetch(`${config.serverUrl}${endpoint}`, {
		...options,
		headers,
	});

	if (!response.ok) {
		const error = await response.json();

		throw new ApiError(error.statusCode, error.message);
	}

	return response.json();
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

				return thunkAPI.rejectWithValue({
					name: error instanceof Error ? error.name : "Error",
					statusCode: 500,
					message: error instanceof Error ? error.message : "An error occurred",
				});
			}
		},
	);
};
