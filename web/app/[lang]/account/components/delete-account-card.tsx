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

import { useI18n } from "@/components/layout/i18n-provider";

export default function DeleteAccountCard() {
	const { t } = useI18n();
	const dispatch = useDispatch<AppDispatch>();

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t("account.deleteAccount.title")}</CardTitle>
				<CardDescription>
					{t("account.deleteAccount.description")}
				</CardDescription>
			</CardHeader>

			<CardContent>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button className="w-full" size="xl" variant="destructive">
							{t("account.deleteAccount.alert.trigger")}
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								{t("account.deleteAccount.alert.title")}
							</AlertDialogTitle>
							<AlertDialogDescription>
								{t("account.deleteAccount.alert.description")}
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>
								{t("account.deleteAccount.alert.cancel")}
							</AlertDialogCancel>
							<AlertDialogAction
								onClick={() => {
									dispatch(deleteMeAsync());
								}}
							>
								{t("account.deleteAccount.alert.continue")}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</CardContent>
		</Card>
	);
}
