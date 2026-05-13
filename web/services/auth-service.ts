import { clientFetch } from "@/lib/api-client";

export const authService = {
	login: (body: { email: string; password: string }) =>
		clientFetch<{ token: string }>("/auth/login", {
			method: "POST",
			body: JSON.stringify(body),
		}),
	signup: (body: { name: string; email: string; password: string }) =>
		clientFetch<{ token: string }>("/auth/signup", {
			method: "POST",
			body: JSON.stringify(body),
		}),
	resetPassword: (params: { token: string; newPassword: string }) =>
		clientFetch<{ token: string }>("/auth/resetPassword/" + params.token, {
			method: "PATCH",
			body: JSON.stringify({
				newPassword: params.newPassword,
			}),
		}),
	forgotPassword: (body: { email: string }) =>
		clientFetch<{ status: string; message: string }>("/auth/forgotPassword/", {
			method: "POST",
			body: JSON.stringify(body),
		}),
	verify: (token: string) =>
		clientFetch<{ verified: boolean }>("/auth/verify?token=" + token),
};
