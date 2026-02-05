"use client";

import { Table } from "_shared/components/table";

import ImageInput from "./components/imageInput";
import { useSell } from "@hooks/useSell";
import { InputCurrencyRange } from "_shared/components/InputCurrencyRange";
import { InputText } from "_shared/components/inputText";
import { textareaVariants } from "_shared/components/textarea";
import { Section } from "_shared/components/section";
import { InputTags } from "_shared/components/inputTags";
import { Button } from "_shared/shadcn/button";
import { TypographyH4 } from "_shared/shadcn/typography";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "_shared/shadcn/dialog";
import { Controller } from "react-hook-form";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "_shared/components/empty";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { cn } from "@lib/utils";
import { ImageToolbarButton } from "@hooks/imageTooltbarButton";
import { MyOnChangePlugin } from "@hooks/myOnChangePlugin";
import { LoadDescriptionPlugin } from "@hooks/loadDescriptionPlugin";

export default function Page() {
	const {
		columns,
		tableData,

		// Form
		register,
		errors,
		formState,
		handleSubmit,
		control,
		resetForm,

		//
		initialConfig,
		PluginOnChange,
		description,

		displayDialog,
		setDisplayDialog,
		displayEditDialog,
		setDisplayEditDialog,

		onAddProduct,
		onUpdateProduct,
	} = useSell();

	const addItem = () => {
		resetForm();
		setDisplayDialog(true);
	};

	return (
		<Section className="space-y-4">
			<TypographyH4 className="text-center">Your Products</TypographyH4>

			{tableData.length > 0 ? (
				<div className="flex flex-col gap-4">
					<Table columns={columns} data={tableData}></Table>

					<div className="flex justify-end">
						<Button className="!mr-0" onClick={addItem}>
							Add item
						</Button>
					</div>
				</div>
			) : (
				<Empty className="border border-dashed">
					<EmptyHeader>
						<EmptyTitle>Nothing here... yet.</EmptyTitle>
						<EmptyDescription className="max-w-xs text-pretty">
							Get started by creating your first product.
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<Button variant="outline" onClick={addItem}>
							Add
						</Button>
					</EmptyContent>
				</Empty>
			)}

			<Dialog open={displayDialog} onOpenChange={setDisplayDialog}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Add item</DialogTitle>
					</DialogHeader>

					<form onSubmit={handleSubmit(onAddProduct)} className="space-y-4">
						<InputText
							type="text"
							id="name"
							placeholder="Product Name"
							icon="person"
							message={errors.name?.message}
							{...register("name", {
								required: "This field is required.",
								minLength: { value: 2, message: "Name is too short." },
								maxLength: { value: 64, message: "Name is too long." },
							})}
						/>

						<div className="relative">
							<LexicalComposer initialConfig={initialConfig}>
								<RichTextPlugin
									contentEditable={
										<ContentEditable
											className={cn(
												textareaVariants({}),
												"block overflow-y-scroll",
											)}
											aria-placeholder="Product Description"
											placeholder={
												<div className="absolute top-[1.25rem] left-[25px] text-gray-400">
													Product Description
												</div>
											}
										/>
									}
									ErrorBoundary={LexicalErrorBoundary}
								/>
								<HistoryPlugin />
								<AutoFocusPlugin />
								<MyOnChangePlugin onChange={PluginOnChange} />
								<ImageToolbarButton />

								<div className="mt-2 text-red-600 text-xs">
									{errors.description?.message}
								</div>

								<input
									type="hidden"
									{...register("description", {
										required: "This field is required.",
									})}
								/>
							</LexicalComposer>
						</div>

						<Controller
							name="priceRangeUsd"
							control={control}
							rules={{
								validate: ({ min, max }) =>
									min != null || max != null || "This field is required.",
							}}
							render={({ field, fieldState }) => (
								<InputCurrencyRange
									minPlaceholder="Price"
									maxPlaceholder="Compare Price"
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
									message={fieldState.error?.message}
								/>
							)}
						/>
						<Controller
							name="tags"
							control={control}
							rules={{
								validate: (value) =>
									value.length > 0 || "This field is required.",
							}}
							render={({ field, fieldState }) => (
								<InputTags
									{...field}
									placeholder="Enter Tags"
									message={fieldState.error?.message}
									value={field.value ?? []}
								/>
							)}
						/>
						<div className="grid grid-cols-5 gap-4">
							{Array.from({ length: 10 }).map((_, index) => (
								<Controller
									key={index}
									name={`images.${index}`}
									control={control}
									render={({ field }) => (
										<ImageInput value={field.value} onChange={field.onChange} />
									)}
								/>
							))}
						</div>

						<DialogFooter>
							<Button type="submit">Add</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog open={displayEditDialog} onOpenChange={setDisplayEditDialog}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Edit item</DialogTitle>
					</DialogHeader>

					<form onSubmit={handleSubmit(onUpdateProduct)} className="space-y-4">
						<InputText
							type="text"
							id="name"
							placeholder="Product Name"
							icon="inventory_2"
							message={errors.name?.message}
							{...register("name", {
								required: "This field is required.",
								minLength: { value: 2, message: "Name is too short." },
								maxLength: { value: 64, message: "Name is too long." },
							})}
						/>

						<div className="relative">
							<LexicalComposer initialConfig={initialConfig}>
								<RichTextPlugin
									contentEditable={
										<ContentEditable
											className={cn(
												textareaVariants({}),
												"block overflow-y-scroll",
											)}
											aria-placeholder="Product Description"
											placeholder={
												<div className="absolute top-[1.25rem] left-[25px] text-gray-400">
													Product Description
												</div>
											}
										/>
									}
									ErrorBoundary={LexicalErrorBoundary}
								/>
								<HistoryPlugin />
								<AutoFocusPlugin />
								<LoadDescriptionPlugin html={description} />
								<ImageToolbarButton />
								<MyOnChangePlugin onChange={PluginOnChange} />

								<div className="mt-2 text-red-600 text-xs">
									{errors.description?.message}
								</div>

								<input
									type="hidden"
									{...register("description", {
										required: "This field is required.",
									})}
								/>
							</LexicalComposer>
						</div>

						<Controller
							name="priceRangeUsd"
							control={control}
							rules={{
								validate: ({ min, max }) =>
									min != null ||
									max != null ||
									"Price and compare price is required.",
							}}
							render={({ field, fieldState }) => (
								<InputCurrencyRange
									minPlaceholder="Price"
									maxPlaceholder="Compare Price"
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
									message={fieldState.error?.message}
								/>
							)}
						/>
						<Controller
							name="tags"
							control={control}
							rules={{
								validate: (value) =>
									value.length > 0 || "This field is required.",
							}}
							render={({ field, fieldState }) => (
								<InputTags
									{...field}
									placeholder="Enter Tags"
									message={fieldState.error?.message}
									value={field.value ?? []}
								/>
							)}
						/>
						<div className="grid grid-cols-5 gap-4">
							{Array.from({ length: 10 }).map((_, index) => (
								<Controller
									key={index}
									name={`images.${index}`}
									control={control}
									render={({ field }) => (
										<ImageInput value={field.value} onChange={field.onChange} />
									)}
								/>
							))}
						</div>

						<DialogFooter className="gap-2">
							<Button
								variant="secondary"
								onClick={() => {
									setDisplayEditDialog(false);
								}}
								type="button"
							>
								Cancel
							</Button>
							<Button type="submit" disabled={!formState.isDirty}>
								Update
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</Section>
	);
}
