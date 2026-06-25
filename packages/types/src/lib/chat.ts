export type ChatSendMessage = {
	message: string;
	previousChat: { role: "user" | "model"; parts: { text: string }[] }[];
};
