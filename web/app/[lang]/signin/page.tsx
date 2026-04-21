"use client";

import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

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

import { Section } from "@/shared/components/ui/section";

import config from "@/lib/config";
import { localizePath } from "@/lib/i18n";

import { handleLogin } from "@/utils/auth-helpers";

type SignUpInput = {
	email: string;
	password: string;
};

export default function Page() {
	const router = useRouter();

	const { locale, t } = useI18n();

	const signInSchema = z.object({
		email: z
			.email(t("validation.emailInvalid"))
			.nonempty(t("validation.required"))
			.max(32, t("validation.emailTooLong")),
		password: z.string().nonempty(t("validation.required")),
	});

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignUpInput>({
		resolver: zodResolver(signInSchema),
		mode: "onSubmit",
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const dispatch = useDispatch();

	const onSubmit = async (data: SignUpInput) => {
		await handleLogin({
			credentials: {
				email: data.email,
				password: data.password,
			},
			dispatch,
			router,
			locale,
		});
	};

	return (
		<Section>
			<Card className="mx-auto w-full max-w-sm">
				<CardHeader>
					<CardTitle>{t("signinPage.title")}</CardTitle>
					<CardDescription>{t("signinPage.description")}</CardDescription>
				</CardHeader>

				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)}>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="email">{t("form.email")}</FieldLabel>
								<FieldContent>
									<Input
										id="email"
										placeholder="m@example.com"
										{...register("email")}
									/>
								</FieldContent>
								<FieldError>{errors.email?.message}</FieldError>
							</Field>

							<Field>
								<div className="flex items-center">
									<FieldLabel htmlFor="password">
										{t("form.password")}
									</FieldLabel>

									<Link
										href={localizePath("/forgot-password", locale)}
										className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
									>
										{t("form.forgotPassword")}
									</Link>
								</div>
								<FieldContent>
									<Input
										id="password"
										type="password"
										{...register("password")}
									/>
								</FieldContent>
								<FieldError>{errors.password?.message}</FieldError>
							</Field>

							<Field>
								<Button type="submit" disabled={isSubmitting}>
									{isSubmitting ? (
										<>
											<Spinner /> {t("signinPage.loggingIn")}
										</>
									) : (
										t("signinPage.login")
									)}
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										window.location.href = `${config.serverUrl}/auth/google`;
									}}
								>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
										<path
											d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
											fill="currentColor"
										/>
									</svg>
									{t("signinPage.loginWithGoogle")}
								</Button>
								<FieldDescription className="text-center">
									{t("signinPage.noAccount")}{" "}
									<Link href={localizePath("/signup", locale)}>
										{t("signinPage.signUp")}
									</Link>
								</FieldDescription>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</Section>
	);
}
