"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Trash2Icon } from "lucide-react";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { User } from "@repo/types";

import { updateMeAsync } from "@/redux/slices/auth-slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";

import { useI18n } from "@/components/layout/i18n-provider";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/shadcn/components/ui/avatar";
import { Button } from "@/shadcn/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shadcn/components/ui/card";
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/shadcn/components/ui/field";
import { Input } from "@/shadcn/components/ui/input";
import { Spinner } from "@/shadcn/components/ui/spinner";
import { TypographyMuted } from "@/shadcn/components/ui/typography";

import { initials } from "@/lib/string-utils";

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

	const dispatch = useAppDispatch();
	const { user } = useAppSelector((state) => state.auth);

	const inputRef = useRef<HTMLInputElement>(null);

	const resetForm = useCallback(() => {
		if (user) {
			reset({
				name: user.name,
				email: user.email,
				photo: {
					url: user.photoUrl || undefined,
				},
			});
		}
	}, [user, reset]);

	useEffect(() => {
		resetForm();
	}, [resetForm]);

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
										render={({ field }) => (
											<PhotoPreview value={field.value} user={user} />
										)}
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

											<Button
												size="icon"
												type="button"
												variant="ghost"
												aria-label={t("account.personalInfo.deleteAvatar")}
												onClick={() => {
													setValue(
														"photo",
														{ url: undefined, file: undefined },
														{ shouldDirty: !!user.photoUrl },
													);
												}}
											>
												<Trash2Icon />
											</Button>
										</div>

										<TypographyMuted className="text-xs">
											{t("account.personalInfo.photoRequirements")}
										</TypographyMuted>
									</div>
								</div>
							</Field>
							<Field>
								<FieldLabel htmlFor="name">{t("form.fullName")}</FieldLabel>
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
								<FieldLabel htmlFor="email">{t("form.email")}</FieldLabel>
								<FieldContent>
									<Input
										id="email"
										type="email"
										placeholder="m@example.com"
										readOnly
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
									{t("buttons.cancel")}
								</Button>

								<Button
									type="submit"
									disabled={!formState.isDirty || isSubmitting}
								>
									{isSubmitting ? (
										<>
											<Spinner /> {t("buttons.saving")}
										</>
									) : (
										t("buttons.save")
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

function PhotoPreview({
	value,
	user,
}: {
	value: {
		url?: string | undefined;
		file?: File | undefined;
	};
	user: User;
}) {
	const { t } = useI18n();

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
}
