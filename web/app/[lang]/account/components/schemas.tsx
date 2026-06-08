import z from "zod";

import { useI18n } from "@/components/layout/i18n-provider";

export function createPersonalInformationSchema(
	t: ReturnType<typeof useI18n>["t"],
) {
	return z.object({
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
}

export function createChangePasswordSchema(t: ReturnType<typeof useI18n>["t"]) {
	return z
		.object({
			currentPassword: z.string().nonempty(t("validation.required")),
			newPassword: z
				.string()
				.nonempty(t("validation.required"))
				.min(8, t("validation.passwordShort"))
				.max(32, t("validation.passwordLong")),
			confirmPassword: z.string().nonempty(t("validation.required")),
		})
		.refine((data) => data.newPassword === data.confirmPassword, {
			message: t("validation.passwordsDontMatch"),
			path: ["confirmPassword"],
		})
		.refine((data) => data.newPassword !== data.currentPassword, {
			message: t("validation.sameAsCurrent"),
			path: ["newPassword"],
		});
}

export type ChangePasswordInput = z.infer<
	ReturnType<typeof createChangePasswordSchema>
>;

export type PersonalInformationInput = z.infer<
	ReturnType<typeof createPersonalInformationSchema>
>;
