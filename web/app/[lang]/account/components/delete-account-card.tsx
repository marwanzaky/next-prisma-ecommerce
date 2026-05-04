"use client";

import { deleteMeAsync } from "@/redux/slices/auth-slice";
import { useAppDispatch } from "@/redux/store";

import { useI18n } from "@/components/layout/i18n-provider";

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
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shadcn/components/ui/card";

export default function DeleteAccountCard() {
	const { t } = useI18n();
	const dispatch = useAppDispatch();

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
							<AlertDialogCancel>{t("buttons.cancel")}</AlertDialogCancel>
							<AlertDialogAction
								onClick={() => {
									dispatch(deleteMeAsync());
								}}
							>
								{t("buttons.continue")}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</CardContent>
		</Card>
	);
}
