"use client";

import * as React from "react";
import {
	Controller,
	useFieldArray,
	UseFormReturn,
	useWatch,
} from "react-hook-form";

import Link from "next/link";

import { ArrowUpDown, PencilIcon, Trash2 } from "lucide-react";

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
import { InputTags } from "@/components/ui/input-tags";
import { ImageToolbarButtonPlugin } from "@/components/ui/lexical/plugins/image-tooltbar-button-plugin";
import { LoadDescriptionPlugin } from "@/components/ui/lexical/plugins/load-description-plugin";
import { OnChangePlugin } from "@/components/ui/lexical/plugins/on-change-plugin";
import YouTubePastePlugin from "@/components/ui/lexical/plugins/youTube-paste-plugin";

import { Badge } from "@/shadcn/components/ui/badge";
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
import { Separator } from "@/shadcn/components/ui/separator";
import { Spinner } from "@/shadcn/components/ui/spinner";

import { localizePath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import { getVariantsColumns } from "./columns";
import { ProductInput } from "./use-sell";

function slugify(text: string): string {
	return text
		.toString()
		.toUpperCase()
		.trim()
		.replace(/\s+/g, "-")
		.replace(/[^\w\-]+/g, "")
		.replace(/\-\-+/g, "-");
}

export function syncAndGenerateVariants(
	options: ProductInput["options"],
	currentVariants: ProductInput["variants"],
	baseSku: string,
): ProductInput["variants"] {
	// 1. Filter out incomplete entries
	const validOptions = options.filter(
		(opt) => opt.name && opt.values.length > 0,
	);
	if (validOptions.length === 0) return [];

	// 2. Compute the Cartesian Product Matrix
	const cartesian = (acc: any[][], curr: string[]): any[][] =>
		acc.flatMap((c) => curr.map((n) => [...c, n]));

	const valueGroups = validOptions.map((opt) => opt.values);
	const combinations = valueGroups.reduce(cartesian, [[]]) as string[][];

	// 3. Create a Set of valid mathematical signature strings for quick lookup
	const generatedSignatures = new Set<string>();

	const targetCombinations = combinations.map((combination) => {
		const selections = combination.map((val, index) => ({
			optionName: validOptions[index].name,
			optionValue: val,
		}));

		const signature = selections
			.map((s) => `${s.optionName}:${s.optionValue}`)
			.sort()
			.join("|");

		generatedSignatures.add(signature);

		return { title: combination.join(" / "), selections, signature };
	});

	// 4. PRESERVE ORDER: Filter out current variants that are still valid mathematically
	const preservedVariants: ProductInput["variants"] = currentVariants.filter(
		(variant) => {
			const variantSignature = variant.selections
				.map((s) => `${s.optionName}:${s.optionValue}`)
				.sort()
				.join("|");
			return generatedSignatures.has(variantSignature);
		},
	);

	// 5. APPEND NEW ENTRIES: Find combinations that aren't present in current state
	const currentSignatures = new Set(
		currentVariants.map((v) =>
			v.selections
				.map((s) => `${s.optionName}:${s.optionValue}`)
				.sort()
				.join("|"),
		),
	);

	const newVariants: ProductInput["variants"] = targetCombinations
		.filter((combo) => !currentSignatures.has(combo.signature))
		.map((combo) => ({
			title: combo.title,
			price: 0,
			stock: 0,
			sku: `${slugify(baseSku)}-${combo.selections.map((s) => slugify(s.optionValue)).join("-")}`,
			selections: combo.selections,
			images: Array.from({ length: 10 }, (_, i) => {
				return undefined;
			}),
		}));

	// Combine them: old preserved array layout first (order kept), then newly added combinations
	return [...preservedVariants, ...newVariants];
}

type ProductBaseProps = {
	productId?: string;
	title: string;
	initialConfig: InitialConfigType;
	form: UseFormReturn<ProductInput>;

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
	productId,
	title,
	initialConfig,
	form,
	description,
	onDescriptionChange,
	options,
	onSubmit,
	loading,
	injectLoadDescriptionPlugin,

	submitButtonText,
	cancelButtonAction,
}: ProductBaseProps) {
	const {
		control,
		register,
		formState: { errors, isDirty },
	} = form;

	const { locale, t } = useI18n();

	const { fields, append, remove } = useFieldArray({
		control,
		name: "options",
	});

	const { fields: fieldsVariants, replace: replaceVariants } = useFieldArray({
		control: form.control,
		name: "variants",
	});

	const optionsWatch = useWatch({ control: form.control, name: "options" });
	const optionsName = useWatch({ control: form.control, name: "name" });

	React.useEffect(() => {
		const currentVariants = form.getValues("variants");

		// Generate the synced matrix list
		const updatedVariants = syncAndGenerateVariants(
			optionsWatch || [],
			currentVariants,
			optionsName.split(" ").slice(0, 3).join("-"),
		);

		// Atomically replace the form's variants array state
		replaceVariants(updatedVariants);
	}, [optionsWatch, replaceVariants]);

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

										<DataTable
											columns={getVariantsColumns({
												t,
												locale,
												productId,
											})}
											data={fieldsVariants}
										/>
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
						<Button type="submit" disabled={!isDirty || loading}>
							{loading && <Spinner />}
							{submitButtonText}
						</Button>
					</div>
				</form>
			</Section>
		</Container>
	);
}

function ProductOption({
	form,
	optionIndex,
	onDelete,
}: {
	form: UseFormReturn<ProductInput>;
	optionIndex: number;
	onDelete: () => void;
}) {
	const [edit, setEdit] = React.useState(false);
	const {
		register,
		control,
		watch,
		formState: { errors },
	} = form;

	const optionName = watch(`options.${optionIndex}.name`);
	const optionValues = watch(`options.${optionIndex}.values`);
	const optionError = errors.options?.[optionIndex];

	return (
		<>
			{edit ? (
				<FieldGroup>
					<Field>
						<FieldLabel htmlFor="option-name">Option name</FieldLabel>
						<Input
							id="option-name"
							placeholder="e.g., Size, Color"
							{...register(`options.${optionIndex}.name`)}
						/>
						<FieldError>{optionError?.name?.message}</FieldError>
					</Field>

					<Field>
						<FieldLabel htmlFor="option-values">Option values</FieldLabel>
						<Controller
							name={`options.${optionIndex}.values`}
							control={control}
							render={({ field }) => (
								<InputTags
									id="option-values"
									placeholder="Press Enter to add tags"
									value={field.value ?? []}
									onChange={field.onChange}
								/>
							)}
						/>
						<FieldError>{optionError?.values?.message}</FieldError>
					</Field>

					<Field orientation="horizontal">
						<Button
							type="button"
							variant="destructive"
							size="sm"
							onClick={onDelete}
						>
							<Trash2 /> Remove option
						</Button>
						<Button type="button" size="sm" onClick={() => setEdit(false)}>
							Done
						</Button>
					</Field>
				</FieldGroup>
			) : (
				<div>
					<div className="flex justify-between items-center">
						<span className="font-medium text-sm">
							{optionName || (
								<span className="italic text-muted-foreground">
									Unnamed Option
								</span>
							)}
						</span>

						<div className="flex gap-1">
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={() => setEdit(true)}
							>
								Edit
							</Button>

							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={onDelete}
							>
								<Trash2 className="text-destructive" />
							</Button>
						</div>
					</div>

					<div className="flex flex-wrap gap-1.5">
						{optionValues.length === 0 ? (
							<span className="text-xs text-muted-foreground italic">
								No values provided
							</span>
						) : (
							optionValues.map((val, idx) => (
								<Badge key={`${val}-${idx}`} variant="secondary">
									{val}
								</Badge>
							))
						)}
					</div>
				</div>
			)}

			<Separator />
		</>
	);
}
