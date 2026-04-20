"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { AppDispatch, useAppSelector } from "@/redux/store";
import { updateMeAsync } from "@/redux/thunks/auth-thunks";

import { ButtonIcon } from "@/shared/components/ui/button-icon";

import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/shadcn/components/ui/field";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/shadcn/components/ui/avatar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shadcn/components/ui/card";
import { TypographyMuted } from "@/shadcn/components/ui/typography";
import { Button } from "@/shadcn/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";
import { Spinner } from "@/shadcn/components/ui/spinner";

import { initials } from "@/utils/string-utils";

import { useI18n } from "@/components/layout/i18n-provider";

export default function PersonalInformationCard() {
	const { t } = useI18n();

	const PersonalInformationSchema = z.object({
		name: z
			.string()
			.nonempty(t("validation.required"))
			.regex(/^[a-zA-Z0-9\s'-]+$/, t("validation.invalidChars"))
			.min(2, t("validation.nameShort"))
			.max(32, t("validation.nameLong")),
		email: z
			.email(t("validation.emailInvalid"))
			.nonempty(t("validation.required")),
		photo: z.object({
			url: z.url(t("validation.invalidUrl")).optional(),
			file: z.instanceof(File).optional(),
		}),
	});

	type PersonalInformationInput = z.infer<typeof PersonalInformationSchema>;

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
		if (user) {
			reset({
				name: user.name,
				email: user.email,
				photo: {
					url: user.photoUrl || undefined,
				},
			});
		}
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
					<CardTitle>{t("account.personalInfo.title")}</CardTitle>
					<CardDescription>
						{t("account.personalInfo.description")}
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
									alert(t("validation.imageTooLarge"));
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
								<FieldLabel>
									{t("account.personalInfo.profilePhoto")}
								</FieldLabel>
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
														alt={t("photoOf").replace("{{name}}", user.name)}
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
												{t("account.personalInfo.changeAvatar")}
											</Button>

											<ButtonIcon
												size="sm"
												type="button"
												icon="delete"
												aria-label={t("account.personalInfo.deleteAvatar")}
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
											{t("account.personalInfo.photoRequirements")}
										</TypographyMuted>
									</div>
								</div>
							</Field>
							<Field>
								<FieldLabel htmlFor="name">
									{t("account.personalInfo.fullName")}
								</FieldLabel>
								<FieldContent>
									<Input
										id="name"
										type="text"
										placeholder={t("account.personalInfo.fullNamePlaceholder")}
										{...register("name")}
									/>
								</FieldContent>
								<FieldError>{errors.name?.message}</FieldError>
							</Field>
							<Field>
								<FieldLabel htmlFor="email">
									{t("account.personalInfo.email")}
								</FieldLabel>
								<FieldContent>
									<Input
										id="email"
										type="email"
										placeholder={t("account.personalInfo.emailPlaceholder")}
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
									{t("account.personalInfo.cancel")}
								</Button>

								<Button
									type="submit"
									disabled={!formState.isDirty || isSubmitting}
								>
									{isSubmitting ? (
										<>
											<Spinner /> {t("account.personalInfo.saving")}
										</>
									) : (
										t("account.personalInfo.save")
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
