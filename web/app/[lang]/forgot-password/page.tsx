"use client";

import { useForm } from "react-hook-form";

import { toast } from "sonner";
import z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { forgotPasswordAsync } from "@/redux/slices/auth-slice";
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
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/shadcn/components/ui/field";
import { Input } from "@/shadcn/components/ui/input";
import { Spinner } from "@/shadcn/components/ui/spinner";

import config from "@/lib/config";

export default function Page() {
	const { t } = useI18n();

	const ForgotPasswordSchema = z.object({
		email: z
			.email(t("validation.emailInvalid"))
			.nonempty(t("validation.required")),
	});

	type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		formState,
	} = useForm<ForgotPasswordInput>({
		resolver: zodResolver(ForgotPasswordSchema),
		mode: "onSubmit",
	});

	const dispatch = useAppDispatch();

	const onSubmit = async (data: ForgotPasswordInput) => {
		await dispatch(
			forgotPasswordAsync({
				email: data.email,
			}),
		).unwrap();

		toast(t("forgotPasswordPage.toastTitle"), {
			position: "top-center",
			description: t("forgotPasswordPage.toastDescription").replace(
				"{{email}}",
				data.email,
			),
		});
	};

	return (
		<Container>
			<Section className="m-auto max-w-sm space-y-2 lg:space-y-4">
				<Card>
					<CardHeader>
						<CardTitle>{t("forgotPasswordPage.title")}</CardTitle>
						<CardDescription>
							{t("forgotPasswordPage.description").replace(
								"{{name}}",
								config.websiteName,
							)}
						</CardDescription>
					</CardHeader>

					<CardContent>
						<form onSubmit={handleSubmit(onSubmit)}>
							<FieldGroup>
								<Field>
									<FieldLabel htmlFor="email">{t("form.email")}</FieldLabel>
									<FieldContent>
										<Input id="email" type="email" {...register("email")} />
									</FieldContent>
									<FieldError>{errors.email?.message}</FieldError>
								</Field>

								<Field orientation="horizontal">
									<Button
										type="submit"
										disabled={!formState.isDirty || isSubmitting}
									>
										{isSubmitting ? (
											<>
												<Spinner /> {t("buttons.sending")}
											</>
										) : (
											t("buttons.send")
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
