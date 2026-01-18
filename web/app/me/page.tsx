"use client";

import { useEffect, useRef } from "react";

import { useDispatch } from "react-redux";

import { AppDispatch, useAppSelector } from "@redux/store";
import { updateMeAsync, updateMyPasswordAsync } from "@redux/thunks/authThunks";
import { InputText } from "_shared/components/inputText";
import { Section } from "_shared/components/section";
import { Button } from "_shared/shadcn/button";
import { ButtonIcon } from "_shared/ui/buttonIcon";
import { TypographyH3, TypographyH4 } from "_shared/shadcn/typography";
import { Avatar, AvatarImage } from "_shared/shadcn/avatar";

import { useForm } from "react-hook-form";
import { IUpdateUser } from "_shared/interfaces";
import { toast } from "_shared/shadcn/hooks/use-toast";

function PersonalInformationForm() {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
		reset,
		setValue,
		formState,
	} = useForm<IUpdateUser>();
	const dispatch = useDispatch<AppDispatch>();
	const inputRef = useRef<HTMLInputElement>(null);
	const onAvatarChange: React.ChangeEventHandler<HTMLInputElement> = async (
		event,
	) => {
		if (event.target.files == null || event.target.files.length === 0) {
			return;
		}

		const img = event.target.files[0];

		if (img == null || img.size > 4 * 1024 * 1024) {
			alert("Image size exceeds the 4MB limit");
			event.target.value = "";
			return;
		}

		const reader = new FileReader();

		reader.onload = () => {
			setValue("photo", reader.result as string, { shouldDirty: true });
		};

		reader.readAsDataURL(img);
		event.target.value = "";
	};
	const { user } = useAppSelector((state) => state.authReducer);

	useEffect(() => {
		user && reset(user);
	}, [user]);

	return (
		<form
			onSubmit={handleSubmit((data) => {
				dispatch(updateMeAsync(data));
			})}
			className="space-y-4"
		>
			<input
				ref={inputRef}
				className="hidden"
				type="file"
				accept=".png, .jpg, .jpeg"
				onChange={onAvatarChange}
			/>

			<TypographyH4>Personal Information</TypographyH4>

			<div className="flex flex-col gap-4">
				<div className="flex items-center gap-4">
					<Avatar className="h-12 w-12">
						<AvatarImage src={watch("photo") || "img/avatar.jpg"} />
					</Avatar>

					<div className="flex items-center gap-2">
						<Button
							variant="secondary"
							type="button"
							onClick={() => inputRef.current?.click()}
						>
							Change avatar
						</Button>

						<ButtonIcon
							type="button"
							icon="delete"
							onClick={() => setValue("photo", "", { shouldDirty: true })}
						/>
					</div>
				</div>

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

				<Button size="lg" type="submit" disabled={!formState.isDirty}>
					Save
				</Button>
			</div>
		</form>
	);
}

function ChangePasswordForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
		formState,
		reset,
	} = useForm<{
		currentPassword: string;
		newPassword: string;
		confirmPassword: string;
	}>();
	const dispatch = useDispatch<AppDispatch>();

	return (
		<form
			className="space-y-4"
			onSubmit={handleSubmit((data) => {
				const { currentPassword, newPassword, confirmPassword } = data;
				if (newPassword === confirmPassword) {
					dispatch(updateMyPasswordAsync({ currentPassword, newPassword }));
					reset();
				} else {
					toast({
						title: "The passwords you entered do not match",
						duration: 3000,
						variant: "destructive",
					});
				}
			})}
		>
			<TypographyH4>Change Password</TypographyH4>

			<div className="flex flex-col gap-4">
				<InputText
					type="password"
					placeholder="Current Password"
					icon="password"
					message={errors.currentPassword?.message}
					{...register("currentPassword", {
						required: "This field is required.",
						minLength: { value: 8, message: "Password is too short." },
						maxLength: { value: 32, message: "Password is too long." },
					})}
				/>
				<InputText
					type="password"
					placeholder="New Password"
					icon="password"
					message={errors.newPassword?.message}
					{...register("newPassword", {
						required: "This field is required.",
						minLength: { value: 8, message: "Password is too short." },
						maxLength: { value: 32, message: "Password is too long." },
					})}
				/>
				<InputText
					type="password"
					placeholder="Confirm Password"
					icon="password"
					message={errors.confirmPassword?.message}
					{...register("confirmPassword", {
						required: "This field is required.",
						minLength: { value: 8, message: "Password is too short." },
						maxLength: { value: 32, message: "Password is too long." },
					})}
				/>

				<Button size="lg" type="submit" disabled={!formState.isDirty}>
					Save
				</Button>
			</div>
		</form>
	);
}

// function DeleteAccountForm() {
// 	return (
// 		<form>
// 			<h4 className="">Delete Account</h4>

// 			<p className="mb-4">
// 				No longer want to use our service? You can delete your account here.
// 				This action is not reversible. All information related to this account
// 				will be deleted permanently.
// 			</p>

// 			<ButtonFullRed>Yes, delete my account</ButtonFullRed>
// 		</form>
// 	);
// }

export default function Page() {
	const dispatch = useDispatch<AppDispatch>();
	const { user } = useAppSelector((state) => state.authReducer);

	return (
		<>
			{user == null ? (
				<Section className="m-auto max-w-lg">
					<TypographyH3>loading...</TypographyH3>
				</Section>
			) : (
				<Section className="m-auto max-w-lg">
					<TypographyH3>Settings</TypographyH3>

					<div className="flex flex-col gap-8">
						<PersonalInformationForm />
						<ChangePasswordForm />
						{/* <DeleteAccountForm /> */}
					</div>
				</Section>
			)}
		</>
	);
}
