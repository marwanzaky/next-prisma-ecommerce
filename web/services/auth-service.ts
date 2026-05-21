import { ForgotPassword, Login, ResetPassword, SignUp } from "@repo/database";

import { clientFetch } from "@/lib/api-client";

export const authService = {
	login: (body: Login) =>
		clientFetch<{ token: string }>("/auth/login", {
			method: "POST",
			body: JSON.stringify(body),
		}),
	signup: (body: SignUp) =>
		clientFetch<{ token: string }>("/auth/signup", {
			method: "POST",
			body: JSON.stringify(body),
		}),
	resetPassword: (params: { token: string; body: ResetPassword }) =>
		clientFetch<{ token: string }>("/auth/resetPassword/" + params.token, {
			method: "PATCH",
			body: JSON.stringify(params.body),
		}),
	forgotPassword: (body: ForgotPassword) =>
		clientFetch<{ status: string; message: string }>("/auth/forgotPassword/", {
			method: "POST",
			body: JSON.stringify(body),
		}),
	verify: (token: string) =>
		clientFetch<{ verified: boolean }>("/auth/verify?token=" + token),
};
