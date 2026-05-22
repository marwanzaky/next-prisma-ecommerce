"use client";

import { useState } from "react";

import { ContactMessage, ContactMessageStatus } from "@repo/database";
import { useQuery } from "@tanstack/react-query";

import { contactMessagesService } from "@/services/contact-messages-service";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/shadcn/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/shadcn/components/ui/field";
import { Input } from "@/shadcn/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/shadcn/components/ui/select";
import { Textarea } from "@/shadcn/components/ui/textarea";

import { getMessagesColumns } from "./columns";

export function useAdminMessages() {
	const { data, isLoading, refetch } = useQuery({
		queryKey: ["contact-messages"],
		queryFn: () => contactMessagesService.getAllMessages(),
		staleTime: 0,
	});

	const [visible, setVisible] = useState(false);
	const [selectedMessage, setSelectedMessage] = useState<ContactMessage>();

	const ViewMessageDialog = (
		<Dialog open={visible} onOpenChange={setVisible}>
			<form>
				<DialogContent className="sm:max-w-xs">
					<DialogHeader>
						<DialogTitle>View Message</DialogTitle>
					</DialogHeader>

					{selectedMessage && (
						<>
							<FieldGroup>
								<Field>
									<FieldLabel>Status</FieldLabel>
									<Select
										value={selectedMessage.status}
										onValueChange={async (value: ContactMessageStatus) => {
											const newMessage =
												await contactMessagesService.updateMessageStatus(
													selectedMessage.id,
													value,
												);
											setSelectedMessage(newMessage);
											refetch();
										}}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select a status" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectLabel>Status</SelectLabel>
												<SelectItem value="new">New</SelectItem>
												<SelectItem value="read">Read</SelectItem>
												<SelectItem value="replied">Replied</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
								</Field>
								<Field>
									<FieldLabel htmlFor="date">Date</FieldLabel>
									<Input
										id="date"
										value={new Date(
											selectedMessage.createdAt,
										).toLocaleDateString("en-GB")}
										readOnly
									/>
								</Field>
								<Field>
									<FieldLabel htmlFor="name">Full Name</FieldLabel>
									<Input id="name" value={selectedMessage.name} readOnly />
								</Field>
								<Field>
									<FieldLabel htmlFor="email">Email</FieldLabel>
									<Input id="email" value={selectedMessage.email} readOnly />
								</Field>
								<Field>
									<FieldLabel htmlFor="subject">Subject</FieldLabel>
									<Input
										id="subject"
										value={selectedMessage.subject}
										readOnly
									/>
								</Field>
								<Field>
									<FieldLabel htmlFor="message">Message</FieldLabel>
									<Textarea
										id="message"
										value={selectedMessage.message}
										readOnly
									/>
								</Field>
							</FieldGroup>
						</>
					)}
				</DialogContent>
			</form>
		</Dialog>
	);

	return {
		columns: getMessagesColumns({
			onDeleteMessage: (id) => {
				contactMessagesService.deleteMessage(id);
				refetch();
			},
			viewMessageAction: (row) => {
				setSelectedMessage(row);
				setVisible(true);
			},
		}),
		isLoading,
		data,
		ViewMessageDialog,
	};
}
