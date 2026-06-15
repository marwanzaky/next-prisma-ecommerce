"use client";

import * as React from "react";
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";

import Link from "next/link";

import { PublicCategoryTree } from "@repo/database";

import {
	InitialConfigType,
	LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";

import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { useI18n } from "@/components/layout/i18n-provider";
import { DataTable } from "@/components/ui/data-table/data-table";
import ImageInput from "@/components/ui/image-input";
import { InputCurrencyRange } from "@/components/ui/input-currency-range";
import { InputTags } from "@/components/ui/input-tags";
import InputWithPlusMinusButtons from "@/components/ui/input-with-plus-minus-buttons";
import { ImageToolbarButtonPlugin } from "@/components/ui/lexical/plugins/image-tooltbar-button-plugin";
import { LoadDescriptionPlugin } from "@/components/ui/lexical/plugins/load-description-plugin";
import { OnChangePlugin } from "@/components/ui/lexical/plugins/on-change-plugin";
import YouTubePastePlugin from "@/components/ui/lexical/plugins/youTube-paste-plugin";

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
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shadcn/components/ui/select";
import { Spinner } from "@/shadcn/components/ui/spinner";

import { localizePath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import { getVariantsColumns } from "../columns";
import { ProductInput } from "../use-sell";
import { ProductOption } from "./product-option";
import { useStoreProducts } from "./use-store-products";

type ProductBaseProps = {
	productId?: string;
	title: string;
	initialConfig: InitialConfigType;
	form: UseFormReturn<ProductInput>;

	description: string;
	onDescriptionChange: (html: string, isEmpty: boolean) => void;
	options: PublicCategoryTree[];
	onSubmit: React.SubmitEventHandler<HTMLFormElement>;

	injectLoadDescriptionPlugin?: boolean;

	submitButtonText: string;
	cancelButtonAction?: () => void;
};

export function ProductBase({
	productId,
	title,
	initialConfig,
	form,
	description,
	onDescriptionChange,
	options,
	onSubmit,
	injectLoadDescriptionPlugin,

	submitButtonText,
	cancelButtonAction,
}: ProductBaseProps) {
	const {
		control,
		register,
		formState: { errors, isDirty, isSubmitting },
	} = form;

	const { locale, t } = useI18n();

	const { hasVariants, variantsWatch } = useStoreProducts({
		form,
		productId,
		title,
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "options",
	});

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
							<BreadcrumbPage>{title}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				<form className="space-y-4" onSubmit={onSubmit}>
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="sm:w-1/2">
							<Card className="h-fit">
								<CardContent>
									<FieldGroup>
										<Field>
											<FieldLabel htmlFor="name">
												{t("storeProductsPage.form.name")}
											</FieldLabel>
											<Input
												id="name"
												placeholder={t(
													"storeProductsPage.form.namePlaceholder",
												)}
												{...register("name")}
											/>
											{errors.name && (
												<FieldError>{errors.name.message}</FieldError>
											)}
										</Field>

										<Field>
											<FieldLabel>
												{t("storeProductsPage.form.description")}
											</FieldLabel>
											<div
												className={cn(
													"relative flex flex-col w-full rounded-md border border-input bg-transparent text-sm transition-colors",
													"focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
												)}
											>
												<LexicalComposer initialConfig={initialConfig}>
													<ImageToolbarButtonPlugin />
													<RichTextPlugin
														contentEditable={
															<ContentEditable className="prose prose-slate text-sm min-h-40 max-h-100 overflow-y-scroll w-full px-2.5 py-2 focus:outline-none" />
														}
														ErrorBoundary={LexicalErrorBoundary}
													/>
													<HistoryPlugin />
													<OnChangePlugin onChange={onDescriptionChange} />
													{injectLoadDescriptionPlugin && (
														<LoadDescriptionPlugin json={description} />
													)}

													<YouTubePastePlugin />
													<ListPlugin />
												</LexicalComposer>
											</div>
											{errors.description && (
												<FieldError>{errors.description.message}</FieldError>
											)}
										</Field>

										{!hasVariants && (
											<Field>
												<FieldLabel>
													{t("storeProductsPage.form.media")}
												</FieldLabel>
												<div className="grid grid-cols-5 gap-4">
													{Array.from({ length: 10 }).map((_, index) => (
														<Controller
															key={index}
															name={`variants.0.images.${index}`}
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
												<FieldError>
													{errors.variants?.[0]?.images?.message}
												</FieldError>
											</Field>
										)}
									</FieldGroup>
								</CardContent>
							</Card>
						</div>

						<div className="sm:w-1/2 space-y-4">
							<Card className="h-fit">
								<CardContent>
									<Field>
										<FieldLabel>Variants</FieldLabel>

										{fields.length > 0 ? (
											<div className="border p-2 rounded-lg space-y-2">
												{fields.map((field, index) => (
													<ProductOption
														key={field.id}
														form={form}
														optionIndex={index}
														onDelete={() => remove(index)}
													/>
												))}

												<Button
													className="w-full"
													type="button"
													variant="outline"
													onClick={() => append({ name: "", values: [] })}
												>
													Add another option
												</Button>
											</div>
										) : (
											<Button
												className="w-full"
												type="button"
												variant="outline"
												onClick={() => append({ name: "", values: [] })}
											>
												Add options like size or color
											</Button>
										)}

										{hasVariants && (
											<DataTable
												columns={getVariantsColumns({
													t,
													locale,
													productId,
												})}
												data={variantsWatch}
											/>
										)}
									</Field>
								</CardContent>
							</Card>

							<Card className="h-fit">
								<CardContent>
									<Field>
										<FieldLabel>
											{t("storeProductsPage.form.category")}
										</FieldLabel>
										<Controller
											name="categoryId"
											control={control}
											render={({ field }) => (
												<Select
													value={field.value || undefined}
													onValueChange={(value) =>
														value && field.onChange(value)
													}
												>
													<SelectTrigger>
														<SelectValue
															placeholder={t(
																"storeProductsPage.form.selectCategory",
															)}
														/>
													</SelectTrigger>
													<SelectContent>
														<SelectGroup>
															{options.map((item) => (
																<SelectItem
																	key={`select-item-${item.id}`}
																	value={item.id}
																>
																	{item.name[locale]}
																</SelectItem>
															))}
														</SelectGroup>
													</SelectContent>
												</Select>
											)}
										/>
										{errors.categoryId && (
											<FieldError>{errors.categoryId.message}</FieldError>
										)}
									</Field>
								</CardContent>
							</Card>

							<Card className="h-fit">
								<CardContent>
									<Field>
										<FieldLabel>{t("storeProductsPage.form.tags")}</FieldLabel>
										<Controller
											name="tags"
											control={control}
											render={({ field }) => (
												<InputTags
													{...field}
													placeholder={t(
														"storeProductsPage.form.tagsPlaceholder",
													)}
													value={field.value ?? []}
												/>
											)}
										/>
										{errors.tags && (
											<FieldError>{errors.tags.message}</FieldError>
										)}
									</Field>
								</CardContent>
							</Card>

							{!hasVariants && (
								<>
									<Card className="h-fit">
										<CardContent>
											<Field>
												<FieldLabel>
													{t("storeProductsPage.form.price")}
												</FieldLabel>
												<Controller
													name="variants.0.priceRangeUsd"
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

												{(errors.variants?.[0]?.priceRangeUsd?.min ||
													errors.variants?.[0]?.priceRangeUsd?.max) && (
													<FieldError>
														{errors.variants[0].priceRangeUsd.min?.message ||
															errors.variants[0].priceRangeUsd.max?.message}
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
													name="variants.0.stock"
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

												<FieldError>
													{errors.variants?.[0]?.stock?.message}
												</FieldError>
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
													{...register("variants.0.sku")}
												/>
												{errors.variants?.[0]?.sku && (
													<FieldError>
														{errors.variants[0].sku.message}
													</FieldError>
												)}
											</Field>
										</CardContent>
									</Card>
								</>
							)}
						</div>
					</div>

					<div className="flex justify-end gap-2">
						{cancelButtonAction && (
							<Button
								type="button"
								variant="outline"
								onClick={cancelButtonAction}
							>
								{t("buttons.cancel")}
							</Button>
						)}
						<Button type="submit" disabled={!isDirty || isSubmitting}>
							{isSubmitting ? (
								<>
									<Spinner /> {t("buttons.saving")}
								</>
							) : (
								t("buttons.save")
							)}
						</Button>
					</div>
				</form>
			</Section>
		</Container>
	);
}
