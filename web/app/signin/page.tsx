"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { useDispatch } from "react-redux";
import { handleLogin } from "@utils/authHelpers";
import { InputText } from "_shared/components/inputText";
import { SubmitHandler, useForm } from "react-hook-form";
import { Section } from "_shared/components/section";
import { Button } from "_shared/shadcn/button";
import { TypographyH4 } from "_shared/shadcn/typography";
import { useToast } from "_shared/shadcn/hooks/use-toast";

type Inputs = {
	email: string;
	password: string;
};

export default function Page() {
	const router = useRouter();
	const { toast } = useToast();

	const { register, handleSubmit } = useForm<Inputs>();

	const dispatch = useDispatch();

	const onSubmit: SubmitHandler<Inputs> = (data) => {
		handleLogin(data.email, data.password, dispatch, router, toast);
	};

	return (
		<Section>
			<form onSubmit={handleSubmit(onSubmit)} className="m-auto max-w-lg">
				<TypographyH4 className="text-center mb-4">Sign In</TypographyH4>
				<p className="text-center text-grey mb-8 text-muted-foreground">
					Sign in to get personalized product recommendations, save and
					synchronize your data across your devices.
				</p>

				<div className="flex flex-col gap-4">
					<InputText
						type="text"
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

					<Button size="lg" type="submit">
						Sign in
					</Button>

					<p className="text-center text-custom-background">
						Not a member yet?&emsp;
						<Link
							className="hover:underline font-bold text-foreground"
							href="/signup"
						>
							Sign Up
						</Link>
					</p>
				</div>
			</form>
		</Section>
	);
}
