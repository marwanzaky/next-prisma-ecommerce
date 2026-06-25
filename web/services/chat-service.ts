import { clientFetch } from "@/lib/api-client";
import { ChatSendMessage } from "@repo/types";

export const chatService = {
	chat: (body: ChatSendMessage) =>
		clientFetch<string>("/chat", {
			method: "POST",
			body: JSON.stringify(body),
		}),
};
