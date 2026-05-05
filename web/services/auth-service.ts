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
	verify: (token: string) =>
		clientFetch<{ verified: boolean }>("/auth/verify?token=" + token),
};
