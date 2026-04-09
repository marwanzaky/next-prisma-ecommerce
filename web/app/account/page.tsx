"use client";

import { useEffect, useRef, useState } from "react";

import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@redux/store";
import {
	deleteMeAsync,
	updateMeAsync,
	updateMyPasswordAsync,
} from "@redux/thunks/auth-thunks";

import { Section } from "@shared/components/ui/section";
import { ButtonIcon } from "@shared/components/ui/button-icon";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@shadcn/components/ui/alert-dialog";

import { Heading, TypographyMuted } from "@shadcn/components/ui/typography";

import { Controller, useForm } from "react-hook-form";
import { Button } from "@shadcn/components/ui/button";

import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@shadcn/components/ui/field";
import { Input } from "@shadcn/components/ui/input";
import { initials } from "@utils/string-utils";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@shadcn/components/ui/avatar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@shadcn/components/ui/card";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@shadcn/components/ui/spinner";

const PersonalInformationSchema = z.object({
	name: z
		.string()
		.nonempty("This field is required.")
		.regex(/^[a-zA-Z0-9\s'-]+$/, "Invalid characters in name.")
		.min(2, "Name is too short.")
		.max(32, "Name is too long."),
	email: z
		.email()
		.nonempty("This field is required.")
		.min(2, "Email is too short.")
		.max(32, "Email is too short."),
	photo: z.object({
		url: z.url("Must be a valid URL").optional(),
		file: z.instanceof(File).optional(),
	}),
});

type PersonalInformationInput = z.infer<typeof PersonalInformationSchema>;

function PersonalInformationForm() {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
		setValue,
		formState,
		control,
	} = useForm<PersonalInformationInput>({
		resolver: zodResolver(PersonalInformationSchema),
		mode: "onSubmit",
	});

	const dispatch = useDispatch<AppDispatch>();
	const { user } = useAppSelector((state) => state.authReducer);

	const inputRef = useRef<HTMLInputElement>(null);

	const resetForm = () => {
		user &&
			reset({
				name: user.name,
				email: user.email,
				photo: {
					url: user.photoUrl || undefined,
				},
			});
	};

	useEffect(() => {
		resetForm();
	}, [user]);

	const onSubmit = async (data: PersonalInformationInput) => {
		await dispatch(
			updateMeAsync({
				name: data.name,
				email: data.email,
				...(data.photo.file
					? { photoFile: data.photo.file }
					: { photoUrl: data.photo.url }),
			}),
		);
	};

	return (
		user && (
			<Card>
				<CardHeader>
					<CardTitle>Personal information</CardTitle>
					<CardDescription>
						Manage your personal details and how your profile appears Enter your
						information below
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
						<input
							ref={inputRef}
							className="hidden"
							type="file"
							accept=".png, .jpg, .jpeg"
							onChange={async (event) => {
								const file = event.target.files?.[0];
								if (!file) return;

								if (file.size > 4 * 1024 * 1024) {
									alert("Image size exceeds the 4MB limit");
									event.target.value = "";
									return;
								}

								setValue(
									"photo",
									{ url: undefined, file },
									{ shouldDirty: true },
								);
								event.target.value = "";
							}}
						/>

						<FieldGroup>
							<Field>
								<FieldLabel>Profile Photo</FieldLabel>
								<div className="flex items-center gap-4">
									<Controller
										name="photo"
										control={control}
										render={({ field }) => {
											const { value } = field;
											const [previewUrl, setPreviewUrl] = useState(value?.url);

											useEffect(() => {
												let objectURL: string | undefined;

												if (value?.file) {
													objectURL = URL.createObjectURL(value.file);
													setPreviewUrl(objectURL);
												} else {
													setPreviewUrl(value?.url);
												}

												return () => {
													if (objectURL) {
														URL.revokeObjectURL(objectURL);
													}
												};
											}, [value?.file, value?.url]);

											return (
												<Avatar className="h-12 w-12">
													<AvatarImage
														src={previewUrl}
														alt={`Photo of ${user.name}`}
														loading="lazy"
													/>
													<AvatarFallback>{initials(user.name)}</AvatarFallback>
												</Avatar>
											);
										}}
									/>

									<div className="flex flex-col gap-2">
										<div className="flex items-center gap-2">
											<Button
												variant="secondary"
												type="button"
												onClick={() => inputRef.current?.click()}
											>
												Change avatar
											</Button>

											<ButtonIcon
												size="sm"
												type="button"
												icon="delete"
												aria-label="Delete avatar"
												onClick={() => {
													setValue(
														"photo",
														{ url: undefined, file: undefined },
														{ shouldDirty: !!user.photoUrl },
													);
												}}
											/>
										</div>

										<TypographyMuted className="text-xs">
											Must be a .jpg, or .png file smaller than 4MB.
										</TypographyMuted>
									</div>
								</div>
							</Field>
							<Field>
								<FieldLabel htmlFor="name">Full Name</FieldLabel>
								<FieldContent>
									<Input
										id="name"
										type="text"
										placeholder="John Doe"
										{...register("name")}
									/>
								</FieldContent>
								<FieldError>{errors.name?.message}</FieldError>
							</Field>
							<Field>
								<FieldLabel htmlFor="name">Email</FieldLabel>
								<FieldContent>
									<Input
										id="name"
										type="email"
										placeholder="m@example.com"
										{...register("email")}
									/>
								</FieldContent>
								<FieldError>{errors.email?.message}</FieldError>
							</Field>
							<Field orientation="horizontal">
								<Button
									variant="outline"
									disabled={!formState.isDirty || isSubmitting}
									onClick={resetForm}
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
		)
	);
}

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

function ChangePasswordForm() {
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

function DeleteAccountForm() {
	const dispatch = useDispatch<AppDispatch>();

	return (
		<Card>
			<CardHeader>
				<CardTitle>Delete account</CardTitle>
				<CardDescription>
					No longer want to use our service? You can delete your account here.
					This action is not reversible. All information related to this account
					will be deleted permanently.
				</CardDescription>
			</CardHeader>

			<CardContent>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button className="w-full" size="xl" variant="destructive">
							Yes, delete my account
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete your
								account and remove your data from our servers.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={() => {
									dispatch(deleteMeAsync());
								}}
							>
								Continue
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</CardContent>
		</Card>
	);
}

export default function Page() {
	const { user } = useAppSelector((state) => state.authReducer);

	return (
		<Section className="m-auto max-w-sm space-y-2 lg:space-y-4">
			<Heading as="h4" className="text-center">
				Settings
			</Heading>

			<div className="flex flex-col gap-4">
				<PersonalInformationForm />
				<ChangePasswordForm />

				{user && user.role === "admin" && <DeleteAccountForm />}
			</div>
		</Section>
	);
}
