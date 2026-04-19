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

export const ChangePasswordSchema = z
	.object({
		currentPassword: z.string().nonempty("This field is required."),
		newPassword: z
			.string()
			.nonempty("This field is required.")
			.min(8, "Password is too short.")
			.max(32, "Password is too long."),
		confirmPassword: z.string().nonempty("This field is required."),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	})
	.refine((data) => data.newPassword !== data.currentPassword, {
		message: "New password cannot be the same as the current password",
		path: ["newPassword"],
	});

type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;

export default function ChangePasswordCard() {
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
				<CardTitle>Change password</CardTitle>
				<CardDescription>
					Enter your email below to login to your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)}>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="current-password">
								Current Password
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
							<FieldLabel htmlFor="new-password">New Password</FieldLabel>
							<FieldContent>
								<Input
									id="new-password"
									type="password"
									{...register("newPassword")}
								/>
							</FieldContent>
							<FieldError>{errors.newPassword?.message}</FieldError>
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
							<FieldDescription>Please confirm your password.</FieldDescription>
						</Field>

						<Field orientation="horizontal">
							<Button
								variant="outline"
								disabled={!formState.isDirty || isSubmitting}
								onClick={() => reset()}
							>
								Cancel
							</Button>

							<Button
								type="submit"
								disabled={!formState.isDirty || isSubmitting}
							>
								{isSubmitting ? (
									<>
										<Spinner /> Saving...
									</>
								) : (
									"Save"
								)}
							</Button>
						</Field>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
