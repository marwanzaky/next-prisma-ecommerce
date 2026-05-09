"use client";

import * as React from "react";
import { Controller, UseFormReturn } from "react-hook-form";

import Link from "next/link";

import {
	InitialConfigType,
	LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";

import { PublicCategoryTree } from "@repo/types";

import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { useI18n } from "@/components/layout/i18n-provider";
import ImageInput from "@/components/ui/image-input";
import { InputCurrencyRange } from "@/components/ui/input-currency-range";
import { InputTags } from "@/components/ui/input-tags";
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

import { ProductForm } from "./use-sell";

type ProductBaseProps = {
	initialConfig: InitialConfigType;
	form: UseFormReturn<ProductForm>;

	description: string;
	onDescriptionChange: (html: string, isEmpty: boolean) => void;
	options: PublicCategoryTree[];
	onSubmit: React.SubmitEventHandler<HTMLFormElement>;

	loading: boolean;
	injectLoadDescriptionPlugin?: boolean;

	submitButtonText: string;
	cancelButtonAction?: () => void;
};

export function ProductBase({
	initialConfig,
	form: {
		control,
		register,
		formState: { errors },
		formState,
	},

	description,
	onDescriptionChange,
	options,
	onSubmit,
	loading,
	injectLoadDescriptionPlugin,

	submitButtonText,
	cancelButtonAction,
}: ProductBaseProps) {
	const { locale, t } = useI18n();

	return (
		<Container>
			<Section className="max-w-2xl mx-auto space-y-4">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link href={localizePath("/store/products", locale)}>
									{t("storeProductsPage.form.myProducts")}
								</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>

						<BreadcrumbSeparator />

						<BreadcrumbItem>
							<BreadcrumbPage>
								{t("storeProductsPage.form.product")}
							</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				<form className="space-y-4" onSubmit={onSubmit}>
					<div className="flex flex-col sm:flex-row gap-4">
						<Card className="sm:w-1/2">
							<CardContent>
								<FieldGroup>
									<Field>
										<FieldLabel htmlFor="name">
											{t("storeProductsPage.form.name")}
										</FieldLabel>
										<Input
											id="name"
											placeholder={t("storeProductsPage.form.namePlaceholder")}
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
														<ContentEditable
															className={cn(
																"prose prose-slate text-sm min-h-40 max-h-100 overflow-y-scroll w-full px-2.5 py-2 focus:outline-none",
															)}
														/>
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

									<Field>
										<FieldLabel>{t("storeProductsPage.form.media")}</FieldLabel>
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
										<FieldLabel>
											{t("storeProductsPage.form.category")}
										</FieldLabel>
										<Controller
											name="category"
											control={control}
											render={({ field }) => (
												<Select
													value={field.value}
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
																	key={`select-item-${item._id}`}
																	value={item._id}
																>
																	{item.name[locale]}
																</SelectItem>
															))}
														</SelectGroup>
													</SelectContent>
												</Select>
											)}
										/>
										{errors.category && (
											<FieldError>{errors.category.message}</FieldError>
										)}
									</Field>
								</CardContent>
							</Card>
							<Card className="h-fit">
								<CardContent>
									<Field>
										<Field>
											<FieldLabel>
												{t("storeProductsPage.form.tags")}
											</FieldLabel>
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
									</Field>
								</CardContent>
							</Card>
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
						<Button type="submit" disabled={!formState.isDirty || loading}>
							{loading && <Spinner />}
							{submitButtonText}
						</Button>
					</div>
				</form>
			</Section>
		</Container>
	);
}
