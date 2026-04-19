"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

import { AppDispatch } from "@/redux/store";
import { signupAsync } from "@/redux/thunks/auth-thunks";

import { Section } from "@/shared/components/ui/section";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shadcn/components/ui/card";
import { Button } from "@/shadcn/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";

import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/shadcn/components/ui/field";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@/shadcn/components/ui/spinner";
import { localizePath } from "@/lib/i18n";
import { useI18n } from "@/components/layout/i18n-provider";
import config from "@/lib/config";

type SignUpInput = {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
};

export default function Page() {
	const router = useRouter();

	const { locale, t } = useI18n();

	const signUpSchema = z
		.object({
			name: z
				.string()
				.nonempty(t("signup.nameRequired"))
				.min(3, t("signup.nameShort"))
				.max(16, t("signup.nameLong")),
			email: z
				.email(t("signup.emailInvalid"))
				.nonempty(t("signup.emailRequired"))
				.max(32, t("signup.emailTooLong")),
			password: z
				.string()
				.nonempty(t("signup.passwordRequired"))
				.min(8, t("signup.passwordShort"))
				.max(32, t("signup.passwordLong")),
			confirmPassword: z
				.string()
				.nonempty(t("signup.passwordRequired"))
				.min(8, t("signup.passwordShort"))
				.max(32, t("signup.passwordLong")),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: t("signup.passwordsDontMatch"),
			path: ["confirmPassword"],
		});

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignUpInput>({
		resolver: zodResolver(signUpSchema),
		mode: "onSubmit",
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const dispatch = useDispatch<AppDispatch>();

	async function onSubmit(values: SignUpInput) {
		const { name, email, password } = values;
		const action = await dispatch(signupAsync({ name, email, password }));

		if (signupAsync.fulfilled.match(action)) {
			router.push(localizePath("/signin", locale));
		}
	}

	return (
		<Section>
			<Card className="mx-auto w-full max-w-sm">
				<CardHeader>
					<CardTitle>{t("signup.title")}</CardTitle>
					<CardDescription>{t("signup.description")}</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						className="flex flex-col gap-2"
						onSubmit={handleSubmit(onSubmit)}
					>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="name">{t("signup.fullName")}</FieldLabel>
								<FieldContent>
									<Input
										id="name"
										placeholder="John Doe"
										{...register("name")}
									/>
								</FieldContent>
								<FieldError>{errors.name?.message}</FieldError>
							</Field>

							<Field>
								<FieldLabel htmlFor="email">{t("signin.email")}</FieldLabel>
								<FieldContent>
									<Input
										id="email"
										placeholder="m@example.com"
										{...register("email")}
									/>
								</FieldContent>
								<FieldError>{errors.email?.message}</FieldError>
								<FieldDescription>{t("signup.emailHelp")}</FieldDescription>
							</Field>

							<Field>
								<FieldLabel htmlFor="password">
									{t("signup.password")}
								</FieldLabel>
								<FieldContent>
									<Input
										id="password"
										type="password"
										{...register("password")}
									/>
								</FieldContent>
								<FieldError>{errors.password?.message}</FieldError>
								<FieldDescription>{t("signup.passwordHelp")}</FieldDescription>
							</Field>

							<Field>
								<FieldLabel htmlFor="confirm-password">
									{t("signup.confirmPassword")}
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
									{t("signup.confirmPasswordHelp")}
								</FieldDescription>
							</Field>

							<FieldGroup>
								<Field>
									<Button type="submit" disabled={isSubmitting}>
										{isSubmitting ? (
											<>
												<Spinner /> {t("signup.creatingAccount")}
											</>
										) : (
											t("signup.createAccount")
										)}
									</Button>
									<Button
										variant="outline"
										type="button"
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
										{t("signup.signUpWithGoogle")}
									</Button>
									<FieldDescription className="px-6 text-center">
										{t("signup.alreadyHaveAccount")}{" "}
										<Link href={localizePath("/signin", locale)}>
											{t("signup.signIn")}
										</Link>
									</FieldDescription>
								</Field>
							</FieldGroup>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</Section>
	);
}
