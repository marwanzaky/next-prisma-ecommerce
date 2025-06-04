"use client";

import { useEffect, useRef, useState } from "react";

import { useDispatch } from "react-redux";

import { AppDispatch, useAppSelector } from "@redux/store";
import { updateMeAsync, updateMyPasswordAsync } from "@redux/thunks/authThunks";
import { InputText } from "_shared/components/inputText";
import { Section } from "_shared/components/section";
import { Button } from "_shared/shadcn/button";
import { ButtonIcon } from "_shared/ui/buttonIcon";
import { TypographyH3, TypographyH4 } from "_shared/shadcn/typography";
import { Avatar, AvatarImage } from "_shared/shadcn/avatar";

export default function Page() {
	const dispatch = useDispatch<AppDispatch>();
	const { user } = useAppSelector((state) => state.authReducer);

	const inputRef = useRef<HTMLInputElement>(null);

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [photo, setPhoto] = useState<string | null>();

	const saveChanges: React.MouseEventHandler<HTMLButtonElement> = async (
		event,
	) => {
		event.preventDefault();
		dispatch(updateMeAsync({ name, email, photo }));
	};

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
			setPhoto(reader.result as string);
		};

		reader.readAsDataURL(img);
		event.target.value = "";
	};

	const updateMyPasswordForm: React.FormEventHandler<HTMLFormElement> = async (
		event,
	) => {
		event.preventDefault();

		if (newPassword === confirmPassword) {
			dispatch(updateMyPasswordAsync({ currentPassword, newPassword }));
		} else {
			alert("The passwords you entered do not match");
		}
	};

	useEffect(() => {
		if (user) {
			setName(user.name);
			setEmail(user.email);
			setPhoto(user.photo);
		}
	}, [user]);

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
						<form className="space-y-4">
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
										<AvatarImage src={photo || "img/avatar.jpg"} />
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
											onClick={() => setPhoto(null)}
										/>
									</div>
								</div>

								<InputText
									type="text"
									id="name"
									placeholder={name}
									icon="person"
									onChange={(e) => setName(e.target.value)}
								/>
								<InputText
									type="text"
									id="email"
									placeholder={email}
									icon="mail"
									onChange={(e) => setEmail(e.target.value)}
								/>

								<Button size="lg" onClick={saveChanges}>
									Save
								</Button>
							</div>
						</form>

						<form className="space-y-4" onSubmit={updateMyPasswordForm}>
							<TypographyH4>Change Password</TypographyH4>

							<div className="flex flex-col gap-4">
								<InputText
									type="password"
									id="curpass"
									placeholder="Current Password"
									icon="password"
									onChange={(e) => setCurrentPassword(e.target.value)}
								/>
								<InputText
									type="password"
									id="newpass"
									placeholder="New Password"
									icon="password"
									onChange={(e) => setNewPassword(e.target.value)}
								/>
								<InputText
									type="password"
									id="confpass"
									placeholder="Confirm Password"
									icon="password"
									onChange={(e) => setConfirmPassword(e.target.value)}
								/>

								<Button size="lg">Save</Button>
							</div>
						</form>

						{/* <form>
								<h4 className="">Delete Account</h4>

								<p className="mb-4">
									No longer want to use our service? You can delete your account
									here. This action is not reversible. All information related
									to this account will be deleted permanently.
								</p>

								<ButtonFullRed>Yes, delete my account</ButtonFullRed>
							</form> */}
					</div>
				</Section>
			)}
		</>
	);
}
