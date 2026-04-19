import { clientFetch } from "@/lib/api-client";

export const chatService = {
	chat: ({
		message,
		previousChat,
	}: {
		message: string;
		previousChat: string[];
	}) =>
		clientFetch<string>("/chat", {
			method: "POST",
			body: JSON.stringify({ message, previousChat }),
		}),
};
