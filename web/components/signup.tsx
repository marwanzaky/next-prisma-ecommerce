"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@redux/store";
import { signupAsync } from "@redux/thunks/authThunks";
import { InputText } from "_shared/components/inputText";
import { SubmitHandler, useForm } from "react-hook-form";
import { Section } from "_shared/components/section";
import { Button } from "_shared/shadcn/button";
import { TypographyH4 } from "_shared/shadcn/typography";
import { toast } from "_shared/shadcn/hooks/use-toast";

type Form = {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
};

export default function Signup() {
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Form>();

	const dispatch = useDispatch<AppDispatch>();

	const onSubmit: SubmitHandler<Form> = (data) => {
		const { name, email, password, confirmPassword } = data;

		if (password === confirmPassword) {
			dispatch(signupAsync({ name, email, password, router }));
		} else {
			toast({
				title: "The passwords you entered do not match",
				duration: 3000,
				variant: "destructive",
			});
		}
	};

	return (
		<Section>
			<form onSubmit={handleSubmit(onSubmit)} className="m-auto max-w-lg">
				<TypographyH4 className="text-center mb-4">Sign Up</TypographyH4>
				<p className="text-center text-grey mb-8 text-muted-foreground">
					Create an account to unlock all the benefits to easily save and
					synchronize your data across your devices.
				</p>

				<div className="flex flex-col gap-4">
					<InputText
						type="text"
						placeholder="Enter Name"
						icon="person"
						message={errors.name?.message}
						{...register("name", {
							required: "This field is required.",
							minLength: { value: 2, message: "Name is too short." },
							maxLength: { value: 16, message: "Name is too long." },
							pattern: {
								value: /^[a-zA-Z\s'-]+$/,
								message: "Invalid characters in name.",
							},
						})}
					/>
					<InputText
						type="text"
						placeholder="Enter Email"
						icon="mail"
						message={errors.email?.message}
						{...register("email", {
							required: "This field is required.",
							minLength: { value: 2, message: "Email is too short." },
							maxLength: { value: 32, message: "Email is too long." },
							pattern: {
								value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
								message: "Invalid characters in email.",
							},
						})}
					/>
					<InputText
						type="password"
						placeholder="Enter Password"
						icon="password"
						message={errors.password?.message}
						{...register("password", {
							required: "This field is required.",
							minLength: { value: 8, message: "Password is too short." },
							maxLength: { value: 32, message: "Password is too long." },
						})}
					/>
					<InputText
						type="password"
						placeholder="Repeat Password"
						icon="password"
						message={errors.confirmPassword?.message}
						{...register("confirmPassword", {
							required: "This field is required.",
							minLength: { value: 8, message: "Password is too short." },
							maxLength: { value: 32, message: "Password is too long." },
						})}
					/>

					<Button size="lg" type="submit">
						Sign up
					</Button>

					<p className="text-center text-custom-background">
						Have an account?&emsp;
						<Link
							className="hover:underline font-bold text-foreground"
							href="/signin"
						>
							Sign In
						</Link>
					</p>
				</div>
			</form>
		</Section>
	);
}
