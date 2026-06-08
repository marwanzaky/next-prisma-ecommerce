"use client";

import { useCallback, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";

import Link from "next/link";
import { useParams } from "next/navigation";

import z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { TranslatedText } from "@repo/types";

import { updateUserProductVariantAsync } from "@/redux/slices/user-products-slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";

import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { useI18n } from "@/components/layout/i18n-provider";
import ImageInput from "@/components/ui/image-input";
import { InputCurrencyRange } from "@/components/ui/input-currency-range";

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

import { getKeptAndNewImgs } from "@/lib/helper";
import { localizePath } from "@/lib/i18n";

import { createVariantSchema } from "../../../schemas";

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
			stock: 0,
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
				max: variant.compareAtPrice / 100,
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
									{(product.name as TranslatedText)[locale]}
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
					onSubmit={handleSubmit(
						async (data) => {
							const { title, priceRangeUsd, images, sku, stock } = data;

							const { keptImgs, newImgs } = getKeptAndNewImgs(images);

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
						},
						(e) => console.log("e", e),
					)}
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
												<Input
													type="number"
													min={0}
													value={field.value}
													onChange={(e) =>
														field.onChange(Number(e.target.value))
													}
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
