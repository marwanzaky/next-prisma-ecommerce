"use client";

import { useForm } from "react-hook-form";

import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "sonner";
import z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { resetPasswordAsync } from "@/redux/slices/auth-slice";
import { useAppDispatch } from "@/redux/store";

import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
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

import { localizePath } from "@/lib/i18n";

export default function Page() {
	const searchParams = useSearchParams();

	const { locale, t } = useI18n();

	const ResetPasswordSchema = z
		.object({
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
		});

	type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		formState,
	} = useForm<ResetPasswordInput>({
		resolver: zodResolver(ResetPasswordSchema),
		mode: "onSubmit",
	});

	const dispatch = useAppDispatch();

	const router = useRouter();

	const onSubmit = async (data: ResetPasswordInput) => {
		await dispatch(
			resetPasswordAsync({
				token: searchParams.get("token") || "",
				newPassword: data.newPassword,
			}),
		).unwrap();

		toast(t("resetPasswordPage.successToast"), {
			position: "top-center",
		});

		// Redirect and reload the page
		window.location.href = "/";
	};

	return (
		<Container>
			<Section className="m-auto max-w-sm space-y-2 lg:space-y-4">
				<Card>
					<CardHeader>
						<CardTitle>{t("resetPasswordPage.title")}</CardTitle>
						<CardDescription>
							{t("resetPasswordPage.description")}
						</CardDescription>
					</CardHeader>

					<CardContent>
						<form onSubmit={handleSubmit(onSubmit)}>
							<FieldGroup>
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
										type="button"
										disabled={!formState.isDirty || isSubmitting}
										onClick={() => router.push(localizePath("/", locale))}
									>
										{t("buttons.cancel")}
									</Button>

									<Button
										type="submit"
										disabled={!formState.isDirty || isSubmitting}
									>
										{isSubmitting ? (
											<>
												<Spinner /> {t("resetPasswordPage.submitting")}
											</>
										) : (
											t("resetPasswordPage.submit")
										)}
									</Button>
								</Field>
							</FieldGroup>
						</form>
					</CardContent>
				</Card>
			</Section>
		</Container>
	);
}
