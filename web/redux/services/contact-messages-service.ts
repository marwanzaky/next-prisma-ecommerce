import { clientFetch } from "@/lib/api-client";

export type IContactMessage = {
	_id: string;
	name: string;
	email: string;
	subject: string;
	message: string;
	createdAt: string;
	status: "new" | "read" | "replied";
};

export const contactMessagesService = {
	getAllMessages: () => clientFetch<IContactMessage[]>("/contact-messages"),
	sendMessage: (body: {
		name: string;
		email: string;
		subject: string;
		message: string;
	}) =>
		clientFetch<void>("/contact-messages", {
			method: "POST",
			body: JSON.stringify(body),
		}),
	updateMessageStatus: (id: string, status: "new" | "read" | "replied") =>
		clientFetch<IContactMessage>(`/contact-messages/${id}`, {
			method: "PATCH",
			body: JSON.stringify({ status }),
		}),
	deleteMessage: (id: string) =>
		clientFetch<void>(`/contact-messages/${id}`, {
			method: "DELETE",
		}),
};
