"use client";

import { useEffect, useRef, useState } from "react";

import clsx from "clsx";

import { chatService } from "@/services/chat-service";

import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shadcn/components/ui/dialog";
import { Input } from "@/shadcn/components/ui/input";
import { BotIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

type ChatbotMessage = {
	type: "ai" | "user";
	text: string;
	date: string;
};

function Message({
	type,
	children,
	date,
}: {
	type: "ai" | "user";
	children: React.ReactNode;
	date: string;
}) {
	return (
		<div
			className={clsx("flex", type === "ai" ? "justify-start" : "justify-end")}
		>
			<div
				className={clsx(
					"flex flex-col gap-1 max-w-[16rem]",
					type === "ai" ? "items-start" : "items-end",
				)}
			>
				<div
					className={clsx(
						"p-2 rounded-md shadow-sm",
						type === "ai" ? "border" : "bg-primary text-white",
					)}
				>
					{children}
				</div>
				<div className="text-gray-500 text-xs leading-none">{date}</div>
			</div>
		</div>
	);
}

export default function Chatbot() {
	const ref = useRef<HTMLDivElement>(null);

	const [open, setOpen] = useState(false);

	const [inputValue, setInputValue] = useState("");
	const [messages, setMessages] = useState<ChatbotMessage[]>([
		{
			type: "ai",
			text: "How can I assist you today?",
			date: "13:34 PM",
		},
		{
			type: "user",
			text: "I'm looking for running shoes under $100.",
			date: "13:35 PM",
		},
		{
			type: "ai",
			text: "Our products range from $10 to $100. Is there a specific item you're interested in?",
			date: "13:35 PM",
		},
	]);

	useEffect(() => {
		if (ref.current) {
			ref.current.scrollTop = ref.current.scrollHeight;
		}
	}, [messages]);

	const onSumbit: React.KeyboardEventHandler<HTMLInputElement> = async (e) => {
		if (e.key === "Enter" && inputValue) {
			setMessages((value) => [
				...value,
				{
					type: "user",
					text: inputValue,
					date: new Date().toLocaleTimeString([], {
						hour: "numeric",
						minute: "2-digit",
						hour12: true,
					}),
				},
			]);

			setInputValue("");

			const res = await chatService.chat({
				message: inputValue,
				previousChat: messages.map((item) => {
					switch (item.type) {
						case "ai":
							return { role: "model", parts: [{ text: item.text }] };
						default:
							return { role: "user", parts: [{ text: item.text }] };
					}
				}),
			});

			setMessages((value) => [
				...value,
				{
					type: "ai",
					text: res,
					date: new Date().toLocaleTimeString([], {
						hour: "numeric",
						minute: "2-digit",
						hour12: true,
					}),
				},
			]);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen} modal={false}>
			<DialogTrigger asChild>
				<button
					type="button"
					aria-expanded={open}
					className="fixed z-50 bottom-4 right-4 flex items-center gap-4 px-5 py-3 rounded-full shadow-lg bg-linear-to-r from-purple-200 via-pink-200 to-rose-100"
				>
					<BotIcon />

					<span className="font-medium">AI Chat</span>

					{open ? (
						<ChevronUpIcon className="size-4" />
					) : (
						<ChevronDownIcon className="size-4" />
					)}
				</button>
			</DialogTrigger>

			<DialogContent className="md:max-w-sm left-auto top-auto translate-x-0 translate-y-0 bottom-4 right-4">
				<DialogHeader>
					<DialogTitle>AI Assistance</DialogTitle>
					<DialogDescription>
						Get instant help with your shopping, orders, and questions—24/7 AI
						support.
					</DialogDescription>
				</DialogHeader>

				<div
					className="flex flex-col gap-4 h-96 overflow-auto no-scrollbar"
					ref={ref}
				>
					{messages.map((item, i) => (
						<Message
							key={"chatbox-message-" + i}
							type={item.type}
							date={item.date}
						>
							{item.text}
						</Message>
					))}
				</div>

				<DialogFooter className="sm:justify-start">
					<Input
						className="w-full"
						placeholder="Enter your message"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyDown={onSumbit}
					/>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
