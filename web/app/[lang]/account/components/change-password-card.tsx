"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { AppDispatch } from "@/redux/store";
import { updateMyPasswordAsync } from "@/redux/thunks/auth-thunks";

import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/shadcn/components/ui/field";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shadcn/components/ui/card";
import { Button } from "@/shadcn/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";
import { Spinner } from "@/shadcn/components/ui/spinner";

import { useI18n } from "@/components/layout/i18n-provider";

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
	const dispatch = useDispatch<AppDispatch>();

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
								{t("account.changePassword.cancel")}
							</Button>

							<Button
								type="submit"
								disabled={!formState.isDirty || isSubmitting}
							>
								{isSubmitting ? (
									<>
										<Spinner /> {t("account.changePassword.saving")}
									</>
								) : (
									t("account.changePassword.save")
								)}
							</Button>
						</Field>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
