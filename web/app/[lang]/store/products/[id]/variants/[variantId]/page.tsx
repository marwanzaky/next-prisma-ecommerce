"use client";

import { useCallback, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";

import Link from "next/link";
import { useParams } from "next/navigation";

import z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateProductVariant } from "@repo/database";

import { updateUserProductVariantAsync } from "@/redux/slices/user-products-slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";

import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { useI18n } from "@/components/layout/i18n-provider";
import ImageInput from "@/components/ui/image-input";
import { InputCurrencyRange } from "@/components/ui/input-currency-range";
import InputWithPlusMinusButtons from "@/components/ui/input-with-plus-minus-buttons";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/shadcn/components/ui/breadcrumb";
import { Button } from "@/shadcn/components/ui/button";
import { Card, CardContent } from "@/shadcn/components/ui/card";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/shadcn/components/ui/field";
import { Input } from "@/shadcn/components/ui/input";
import { Spinner } from "@/shadcn/components/ui/spinner";

import { localizePath } from "@/lib/i18n";

function createVariantSchema(t: ReturnType<typeof useI18n>["t"]) {
	const imageSlotSchema = z
		.object({
			url: z.url().optional(),
			file: z.instanceof(File).optional(),
		})
		.optional();

	return z.object({
		title: z
			.string()
			.min(2, t("validation.nameShort"))
			.max(120, t("validation.nameLong"))
			.nullable(),
		stock: z.number().positive(),
		sku: z.string().nullable(),
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
		images: z
			.array(imageSlotSchema)
			.max(10, "Max 10 images")
			.refine((imgs) => imgs.some((img) => Boolean(img?.url || img?.file)), {
				message: t("validation.required"),
			}),
	});
}

export type VariantInput = z.infer<ReturnType<typeof createVariantSchema>>;

export default function Page() {
	const params = useParams<{ variantId: string; id: string }>();

	const { products } = useAppSelector((state) => state.userProducts);

	const product = useMemo(
		() => products.find((product) => product.id === params.id),
		[products, params],
	);

	const variant = useMemo(
		() =>
			products
				.find((product) => product.id === params.id)
				?.variants.find((variant) => variant.id === params.variantId),
		[products, params],
	);

	const { t, locale } = useI18n();

	const dispatch = useAppDispatch();

	const variantSchema = createVariantSchema(t);

	const {
		reset,
		handleSubmit,
		control,
		register,
		formState: { errors, isSubmitting },
		formState,
	} = useForm<VariantInput>({
		resolver: zodResolver(variantSchema),
		mode: "onChange",
		defaultValues: {
			title: undefined,
			priceRangeUsd: {
				min: undefined,
				max: undefined,
			},
			sku: undefined,
			stock: undefined,
			images: [],
		},
	});

	const resetForm = useCallback(() => {
		if (!variant) {
			return;
		}

		reset({
			title: variant.title,
			priceRangeUsd: {
				min: variant.price / 100,
				max: variant.compareAtPrice
					? variant.compareAtPrice / 100
					: variant.price,
			},
			stock: variant.stock,
			sku: variant.sku,
			images: Array.from({ length: 10 }, (_, i) => {
				const el = variant.imgUrls[i];
				return el ? { url: el } : undefined;
			}),
		});
	}, [variant]);

	useEffect(() => {
		resetForm();
	}, [resetForm]);

	if (!product || !variant) {
		return <div>not found</div>;
	}

	return (
		<Container>
			<Section className="max-w-2xl mx-auto space-y-4">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link href={localizePath("/store/products", locale)}>
									Products
								</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>

						<BreadcrumbSeparator />

						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link
									href={localizePath(`/store/products/${product.id}`, locale)}
								>
									{product.name[locale]}
								</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>

						<BreadcrumbSeparator />

						<BreadcrumbItem>
							<BreadcrumbPage>{variant.title}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				<form
					className="space-y-4"
					onSubmit={handleSubmit(async (data) => {
						const { title, priceRangeUsd, images, sku, stock } = data;

						const keptImgs: UpdateProductVariant["keptImgs"] = images
							.filter((img) => !!img)
							.map((img, index) =>
								img.url ? { url: img.url, index } : undefined,
							)
							.filter((obj) => !!obj);

						const newImgs: UpdateProductVariant["newImgs"] = images
							.filter((img) => !!img)
							.map((img, index) =>
								img.file ? { file: img.file, index } : undefined,
							)
							.filter((obj) => !!obj);

						await dispatch(
							updateUserProductVariantAsync({
								id: params.id,
								variantId: params.variantId,
								data: {
									title,
									price: priceRangeUsd.min * 100,
									compareAtPrice: priceRangeUsd.max * 100,
									keptImgs: keptImgs,
									newImgs: newImgs,
									stock,
									sku,
								},
							}),
						);
					})}
				>
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="sm:w-1/2 space-y-4">
							<Card className="h-fit">
								<CardContent>
									<FieldGroup>
										<Field>
											<FieldLabel htmlFor="title">Title</FieldLabel>
											<Input
												id="title"
												placeholder="Black / S"
												{...register("title")}
											/>
											{errors.title && (
												<FieldError>{errors.title.message}</FieldError>
											)}
										</Field>

										<Field>
											<FieldLabel>
												{t("storeProductsPage.form.media")}
											</FieldLabel>
											<div className="grid grid-cols-5 gap-4">
												{Array.from({ length: 10 }).map((_, index) => (
													<Controller
														key={index}
														name={`images.${index}`}
														control={control}
														render={({ field }) => (
															<ImageInput
																value={field.value}
																onChange={field.onChange}
															/>
														)}
													/>
												))}
											</div>
											{errors.images && (
												<FieldError>{errors.images.message}</FieldError>
											)}
										</Field>
									</FieldGroup>
								</CardContent>
							</Card>
						</div>

						<div className="sm:w-1/2 space-y-4">
							<Card className="h-fit">
								<CardContent>
									<Field>
										<FieldLabel>{t("storeProductsPage.form.price")}</FieldLabel>
										<Controller
											name="priceRangeUsd"
											control={control}
											render={({ field }) => (
												<InputCurrencyRange
													minPlaceholder={t(
														"storeProductsPage.form.priceMinPlaceholder",
													)}
													maxPlaceholder={t(
														"storeProductsPage.form.priceMaxPlaceholder",
													)}
													minValue={field.value.min}
													maxValue={field.value.max}
													onMinChange={(min) =>
														field.onChange({
															min,
															max:
																field.value.max == null
																	? min
																	: Math.max(min || 0, field.value.max),
														})
													}
													onMaxChange={(max) =>
														field.onChange({
															min:
																field.value.min == null
																	? max
																	: Math.min(field.value.min, max || 0),
															max,
														})
													}
												/>
											)}
										/>

										{(errors.priceRangeUsd?.min ||
											errors.priceRangeUsd?.max) && (
											<FieldError>
												{errors.priceRangeUsd.min?.message ||
													errors.priceRangeUsd.max?.message}
											</FieldError>
										)}
									</Field>
								</CardContent>
							</Card>

							<Card className="h-fit">
								<CardContent>
									<Field>
										<FieldLabel>Stock</FieldLabel>
										<Controller
											name="stock"
											control={control}
											render={({ field }) => (
												<InputWithPlusMinusButtons
													min={0}
													size="icon-lg"
													value={field.value}
													onChange={field.onChange}
												/>
											)}
										/>

										<FieldError>{errors.stock?.message}</FieldError>
									</Field>
								</CardContent>
							</Card>

							<Card className="h-fit">
								<CardContent>
									<Field>
										<FieldLabel htmlFor="sku">SKU</FieldLabel>
										<Input
											id="sku"
											placeholder="TS-BLK-S"
											{...register("sku")}
										/>
										{errors.sku && (
											<FieldError>{errors.sku.message}</FieldError>
										)}
									</Field>
								</CardContent>
							</Card>
						</div>
					</div>

					<div className="flex justify-end gap-2">
						<Button type="button" variant="outline" onClick={resetForm}>
							{t("buttons.cancel")}
						</Button>
						<Button type="submit" disabled={!formState.isDirty || isSubmitting}>
							{isSubmitting && <Spinner />}
							Save
						</Button>
					</div>
				</form>
			</Section>
		</Container>
	);
}
