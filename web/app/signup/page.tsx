"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@redux/store";
import { signupAsync } from "@redux/thunks/auth-thunks";
import { useForm } from "react-hook-form";
import { Section } from "@shared/components/ui/section";
import { Button } from "@shadcn/components/ui/button";
import { Input } from "@shadcn/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@shadcn/components/ui/card";

import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@shadcn/components/ui/field";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@shadcn/components/ui/spinner";

const SignUpSchema = z
	.object({
		name: z
			.string()
			.nonempty("This field is required.")
			.min(3, "Name is too short.")
			.max(16, "Name is too long."),
		email: z
			.email()
			.nonempty("This field is required.")
			.max(32, "Email is too short."),
		password: z
			.string()
			.nonempty("This field is required.")
			.min(8, "Password is too short.")
			.max(32, "Password is too long."),
		confirmPassword: z
			.string()
			.nonempty("This field is required.")
			.min(8, "Password is too short.")
			.max(32, "Password is too long."),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

type SignUpInput = z.infer<typeof SignUpSchema>;

export default function Page() {
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignUpInput>({
		resolver: zodResolver(SignUpSchema),
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
			router.push("/signin");
		}
	}

	return (
		<Section>
			<Card className="mx-auto w-full max-w-sm">
				<CardHeader>
					<CardTitle>Create an account</CardTitle>
					<CardDescription>
						Enter your information below to create your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						className="flex flex-col gap-2"
						onSubmit={handleSubmit(onSubmit)}
					>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="name">Full Name</FieldLabel>
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
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<FieldContent>
									<Input
										id="email"
										placeholder="m@example.com"
										{...register("email")}
									/>
								</FieldContent>
								<FieldError>{errors.email?.message}</FieldError>
								<FieldDescription>
									We&apos;ll use this to contact you. We will not share your
									email with anyone else.
								</FieldDescription>
							</Field>

							<Field>
								<FieldLabel htmlFor="password">Password</FieldLabel>
								<FieldContent>
									<Input
										id="password"
										type="password"
										{...register("password")}
									/>
								</FieldContent>
								<FieldError>{errors.password?.message}</FieldError>
								<FieldDescription>
									Must be at least 8 characters long.
								</FieldDescription>
							</Field>

							<Field>
								<FieldLabel htmlFor="confirm-password">
									Confirm Password
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
									Please confirm your password.
								</FieldDescription>
							</Field>

							<FieldGroup>
								<Field>
									<Button type="submit" disabled={isSubmitting}>
										{isSubmitting ? (
											<>
												<Spinner /> Creating account...
											</>
										) : (
											"Create account"
										)}
									</Button>
									<Button
										variant="outline"
										type="button"
										onClick={() => {
											window.location.href = `${process.env.NEXT_PUBLIC_SERVER!}/auth/google`;
										}}
									>
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
											<path
												d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
												fill="currentColor"
											/>
										</svg>
										Sign up with Google
									</Button>
									<FieldDescription className="px-6 text-center">
										Already have an account? <Link href="/signin">Sign in</Link>
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
