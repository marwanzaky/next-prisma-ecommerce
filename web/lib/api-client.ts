import Cookies from "js-cookie";

import config from "./config";

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
		throw new Error(error.message);
	}

	return response.json();
}
