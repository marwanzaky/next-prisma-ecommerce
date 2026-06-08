import z from "zod";

import { useI18n } from "@/components/layout/i18n-provider";

export function createProductSchema(t: ReturnType<typeof useI18n>["t"]) {
	const variantSchema = createVariantSchema(t);

	return z.object({
		name: z
			.string()
			.nonempty(t("validation.required"))
			.min(2, t("validation.nameShort"))
			.max(120, t("validation.nameLong")),
		description: z.string().nonempty(t("validation.required")),
		categoryId: z.string().nonempty(t("validation.required")),
		tags: z.array(z.string()).min(1, t("validation.required")),
		options: z.array(
			z.object({
				name: z.string(),
				values: z.array(z.string()),
			}),
		),
		variants: z.array(variantSchema).min(1, t("validation.required")),
	});
}

export function createVariantSchema(t: ReturnType<typeof useI18n>["t"]) {
	const imageSlotSchema = z
		.object({
			url: z.url().optional(),
			file: z.instanceof(File).optional(),
		})
		.optional();

	return z.object({
		variantId: z.string().optional(),
		title: z
			.string()
			.min(2, t("validation.nameShort"))
			.max(120, t("validation.nameLong")),
		priceRangeUsd: z
			.object({
				min: z
					.number({ error: t("validation.required") })
					.positive(t("validation.mustBePositive")),
				max: z
					.number({ error: t("validation.invalidNumber") })
					.positive(t("validation.mustBePositive")),
			})
			.refine((data) => !data.max || data.max >= data.min, {
				message: t("validation.maxPriceGteMinPrice"),
				path: ["max"],
			}),
		stock: z.number().positive(),
		sku: z.string(),
		selections: z.array(
			z.object({
				optionName: z.string(),
				optionValue: z.string(),
			}),
		),
		images: z.array(imageSlotSchema).max(10, "Max 10 images"),
	});
}
