import { EyeIcon, Trash2Icon } from "lucide-react";

import { ContactMessage } from "@repo/database";
import { ColumnDef } from "@tanstack/react-table";

import { formatDate } from "@repo/types";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/shadcn/components/ui/alert-dialog";
import { Button } from "@/shadcn/components/ui/button";

export const getMessagesColumns = ({
	onDeleteMessage,
	viewMessageAction,
}: {
	onDeleteMessage: (id: string) => void;
	viewMessageAction: (row: ContactMessage) => void;
}): ColumnDef<ContactMessage>[] => [
	{
		header: () => <div className="text-center">Status</div>,
		accessorKey: "status",
		cell: ({ row }) => (
			<div className="capitalize text-center">{row.original.status}</div>
		),
	},
	{
		header: "Name",
		accessorKey: "name",
	},
	{
		header: "Email",
		accessorKey: "email",
	},
	{
		header: "Message",
		accessorKey: "message",
		cell: ({ row }) => {
			return <div className="max-w-xs truncate">{row.original.message}</div>;
		},
	},
	{
		header: "Date",
		accessorKey: "createdAt",
		cell: ({ row }) => {
			return <div>{formatDate(row.original.createdAt)}</div>;
		},
	},
	{
		header: "Actions",
		id: "actions",
		cell: ({ row }) => {
			return (
				<div className="flex items-center gap-1">
					<Button
						variant="ghost"
						size="icon"
						className="rounded-full"
						aria-label="View message"
						onClick={() => {
							viewMessageAction(row.original);
						}}
					>
						<EyeIcon />
					</Button>

					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="rounded-full"
								aria-label="Delete message"
							>
								<Trash2Icon />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently delete the
									message data from our servers.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={() => {
										onDeleteMessage(row.id);
									}}
								>
									Continue
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			);
		},
	},
];
