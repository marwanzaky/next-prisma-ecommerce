"use client";
import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { updateMyPasswordAsync } from "@/redux/slices/auth-slice";
import { useAppDispatch } from "@/redux/store";

import { useI18n } from "@/components/layout/i18n-provider";

import { Button } from "@/shadcn/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shadcn/components/ui/card";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/shadcn/components/ui/field";
import { Input } from "@/shadcn/components/ui/input";
import { Spinner } from "@/shadcn/components/ui/spinner";

export default function ChangePasswordCard() {
	const { t } = useI18n();

	const ChangePasswordSchema = z
		.object({
			currentPassword: z.string().nonempty(t("validation.required")),
			newPassword: z
				.string()
				.nonempty(t("validation.required"))
				.min(8, t("validation.passwordShort"))
				.max(32, t("validation.passwordLong")),
			confirmPassword: z.string().nonempty(t("validation.required")),
		})
		.refine((data) => data.newPassword === data.confirmPassword, {
			message: t("validation.passwordsDontMatch"),
			path: ["confirmPassword"],
		})
		.refine((data) => data.newPassword !== data.currentPassword, {
			message: t("validation.sameAsCurrent"),
			path: ["newPassword"],
		});

	type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		formState,
		reset,
	} = useForm<ChangePasswordInput>({
		resolver: zodResolver(ChangePasswordSchema),
		mode: "onSubmit",
	});
	const dispatch = useAppDispatch();

	const onSubmit = async (data: ChangePasswordInput) => {
		const { currentPassword, newPassword } = data;
		await dispatch(updateMyPasswordAsync({ currentPassword, newPassword }));
		reset();
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t("account.changePassword.title")}</CardTitle>
				<CardDescription>
					{t("account.changePassword.description")}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)}>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="current-password">
								{t("account.changePassword.currentPassword")}
							</FieldLabel>
							<FieldContent>
								<Input
									id="current-password"
									type="password"
									{...register("currentPassword")}
								/>
							</FieldContent>
							<FieldError>{errors.currentPassword?.message}</FieldError>
						</Field>

						<Field>
							<FieldLabel htmlFor="new-password">
								{t("account.changePassword.newPassword")}
							</FieldLabel>
							<FieldContent>
								<Input
									id="new-password"
									type="password"
									{...register("newPassword")}
								/>
							</FieldContent>
							<FieldError>{errors.newPassword?.message}</FieldError>
							<FieldDescription>
								{t("account.changePassword.newPasswordHelp")}
							</FieldDescription>
						</Field>

						<Field>
							<FieldLabel htmlFor="confirm-password">
								{t("account.changePassword.confirmPassword")}
							</FieldLabel>
							<FieldContent>
								<Input
									id="confirm-password"
									type="password"
									{...register("confirmPassword")}
								/>
							</FieldContent>
							<FieldError>{errors.confirmPassword?.message}</FieldError>
							<FieldDescription>
								{t("account.changePassword.confirmPasswordHelp")}
							</FieldDescription>
						</Field>

						<Field orientation="horizontal">
							<Button
								variant="outline"
								disabled={!formState.isDirty || isSubmitting}
								onClick={() => reset()}
							>
								{t("buttons.cancel")}
							</Button>

							<Button
								type="submit"
								disabled={!formState.isDirty || isSubmitting}
							>
								{isSubmitting ? (
									<>
										<Spinner /> {t("buttons.saving")}
									</>
								) : (
									t("buttons.save")
								)}
							</Button>
						</Field>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
