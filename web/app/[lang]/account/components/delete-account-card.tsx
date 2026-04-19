"use client";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { deleteMeAsync } from "@/redux/thunks/auth-thunks";

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
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shadcn/components/ui/card";
import { Button } from "@/shadcn/components/ui/button";

export default function DeleteAccountCard() {
	const dispatch = useDispatch<AppDispatch>();

	return (
		<Card>
			<CardHeader>
				<CardTitle>Delete account</CardTitle>
				<CardDescription>
					No longer want to use our service? You can delete your account here.
					This action is not reversible. All information related to this account
					will be deleted permanently.
				</CardDescription>
			</CardHeader>

			<CardContent>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button className="w-full" size="xl" variant="destructive">
							Yes, delete my account
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete your
								account and remove your data from our servers.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={() => {
									dispatch(deleteMeAsync());
								}}
							>
								Continue
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</CardContent>
		</Card>
	);
}
