"use client";

import { useRouter } from "next/navigation";

import { Column, Table } from "_shared/components/table";
import { Section } from "_shared/components/section";
import { TypographyH4 } from "_shared/shadcn/typography";
import { useQuery } from "@tanstack/react-query";
import { contactMessagesService } from "@redux/services/contactMessagesService";
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
} from "_shared/shadcn/alertDialog";
import { ButtonIcon } from "_shared/ui/buttonIcon";
import { useAppSelector } from "@redux/store";

export default function Page() {
	const router = useRouter();

	const columns: Column[] = [
		{
			header: "Status",
			field: "status",
			type: "text",
			className: "capitalize",
		},
		{
			header: "Name",
			field: "name",
			type: "text",
		},
		{
			header: "Email",
			field: "email",
			type: "text",
		},
		{
			header: "Message",
			field: "message",
			type: "text",
			className: "max-w-xs truncate",
		},
		{
			header: "Date",
			field: "createdAt",
			type: "date",
		},
		{
			header: "",
			field: "_id",
			type: "action",
			actionIcon: "visibility",
			action: (row) => {},
			width: "38px",
		},
		{
			header: "",
			field: "_id",
			type: "custom",
			width: "38px",
			render(value, row) {
				return (
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<ButtonIcon icon="delete" />
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently delete the
									product data from our servers.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={() => {
										contactMessagesService.deleteMessage(token, row._id);
										refetch();
									}}
								>
									Continue
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				);
			},
		},
	];

	const { token } = useAppSelector((state) => state.authReducer);

	const { data, isLoading, refetch } = useQuery({
		queryKey: ["contact-messages"],
		queryFn: () => contactMessagesService.getAllMessages(token),
		staleTime: 0,
	});

	return (
		<Section>
			<TypographyH4 className="text-center mb-2 lg:mb-4">
				Your Messages
			</TypographyH4>

			{!isLoading && (
				<Table className="mb-8" columns={columns} data={data ? data : []} />
			)}
		</Section>
	);
}
