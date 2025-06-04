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

type Form = {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
};

export default function Signup() {
	const router = useRouter();

	const { register, handleSubmit } = useForm<Form>();

	const dispatch = useDispatch<AppDispatch>();

	const onSubmit: SubmitHandler<Form> = (data) => {
		const { name, email, password, confirmPassword } = data;

		if (password === confirmPassword) {
			dispatch(signupAsync({ name, email, password, router }));
		} else {
			alert("The passwords you entered do not match");
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
						required
						{...register("name", { required: true })}
					/>
					<InputText
						type="email"
						placeholder="Enter Email"
						icon="mail"
						required
						{...register("email", { required: true })}
					/>
					<InputText
						type="password"
						placeholder="Enter Password"
						icon="password"
						required
						{...register("password", { required: true })}
					/>
					<InputText
						type="password"
						placeholder="Repeat Password"
						icon="password"
						required
						{...register("confirmPassword", { required: true })}
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
