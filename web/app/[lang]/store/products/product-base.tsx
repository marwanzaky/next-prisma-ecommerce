"use client";

import { InputCurrencyRange } from "@/shared/components/ui/input-currency-range";
import { InputTags } from "@/shared/components/ui/input-tags";
import { OnChangePlugin } from "@/shared/components/ui/lexical/plugins/on-change-plugin";
import { LoadDescriptionPlugin } from "@/shared/components/ui/lexical/plugins/load-description-plugin";
import { ImageToolbarButtonPlugin } from "@/shared/components/ui/lexical/plugins/image-tooltbar-button-plugin";
import YouTubePastePlugin from "@/shared/components/ui/lexical/plugins/youTube-paste-plugin";
import ImageInput from "@/shared/components/ui/image-input";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shadcn/components/ui/select";
import { Controller, UseFormReturn } from "react-hook-form";

import {
	InitialConfigType,
	LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";

import { cn } from "@/lib/utils";

import { Button } from "@/shadcn/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/shadcn/components/ui/field";
import { Input } from "@/shadcn/components/ui/input";

import Link from "next/link";

import { Section } from "@/shared/components/ui/section";

import { Card, CardContent } from "@/shadcn/components/ui/card";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/shadcn/components/ui/breadcrumb";
import { ProductForm } from "./use-sell";
import { PublicCategoryTree } from "@/shared/types/category.type";
import { Spinner } from "@/shadcn/components/ui/spinner";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";

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
	return (
		<Section className="max-w-2xl mx-auto space-y-4">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link href="/store/products">My Products</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>

					<BreadcrumbSeparator />

					<BreadcrumbItem>
						<BreadcrumbPage>Product</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<form className="space-y-4" onSubmit={onSubmit}>
				<div className="flex flex-col sm:flex-row gap-4">
					<Card className="sm:w-1/2">
						<CardContent>
							<FieldGroup>
								<Field>
									<FieldLabel htmlFor="name">Name</FieldLabel>
									<Input
										id="name"
										placeholder="Short sleeve t-shirt"
										{...register("name")}
									/>
									{errors.name && (
										<FieldError>{errors.name.message}</FieldError>
									)}
								</Field>

								<Field>
									<FieldLabel>Description</FieldLabel>
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
									<FieldLabel>Media</FieldLabel>
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
									<FieldLabel>Price</FieldLabel>
									<Controller
										name="priceRangeUsd"
										control={control}
										render={({ field }) => (
											<InputCurrencyRange
												minPlaceholder="Price"
												maxPlaceholder="Compare"
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

									{(errors.priceRangeUsd?.min || errors.priceRangeUsd?.max) && (
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
									<FieldLabel>Category</FieldLabel>
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
													<SelectValue placeholder="Select category" />
												</SelectTrigger>
												<SelectContent>
													<SelectGroup>
														{options.map((item) => (
															<SelectItem
																key={`select-item-${item.id}`}
																value={item.id}
															>
																{item.name}
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
										<FieldLabel>Tags</FieldLabel>
										<Controller
											name="tags"
											control={control}
											render={({ field }) => (
												<InputTags
													{...field}
													placeholder="Enter Tags"
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
							Cancel
						</Button>
					)}
					<Button type="submit" disabled={!formState.isDirty || loading}>
						{loading && <Spinner />}
						{submitButtonText}
					</Button>
				</div>
			</form>
		</Section>
	);
}
