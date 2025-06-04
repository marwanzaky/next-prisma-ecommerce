"use client";

import { Table } from "_shared/components/table";

import ImageInput from "./components/imageInput";
import { useSell } from "@hooks/useSell";
import { InputCurrencyRange } from "_shared/components/InputCurrencyRange";
import { InputText } from "_shared/components/inputText";
import { Textarea } from "_shared/components/textarea";
import { Section } from "_shared/components/section";
import { InputTags } from "_shared/components/inputTags";
import { Button } from "_shared/shadcn/button";
import { TypographyH4 } from "_shared/shadcn/typography";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "_shared/shadcn/dialog";

export default function Page() {
	const {
		columns,
		tableData,

		name,
		setName,
		description,
		setDescription,
		price,
		setPrice,
		priceCompare,
		setPriceCompare,
		tags,
		setTags,
		base64s,
		setBase64s,

		displayDialog,
		setDisplayDialog,
		displayEditDialog,
		setDisplayEditDialog,

		resetForm,
		imageInputOnClick,
		onSubmitProduct,
		onUpdateProduct,
	} = useSell();

	return (
		<Section className="space-y-4">
			<TypographyH4 className="text-center">Your Products</TypographyH4>

			<div className="flex flex-col gap-4">
				<Table columns={columns} data={tableData}></Table>

				<div className="flex justify-end">
					<Button
						className="!mr-0"
						onClick={() => {
							resetForm();
							setDisplayDialog(true);
						}}
					>
						Add item
					</Button>
				</div>
			</div>

			<Dialog open={displayDialog} onOpenChange={setDisplayDialog}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Add item</DialogTitle>
						<DialogDescription>
							Complete the form to publish your product for sale on the
							platform.
						</DialogDescription>
					</DialogHeader>

					<form onSubmit={onSubmitProduct} className="space-y-4">
						<InputText
							type="text"
							id="name"
							placeholder="Product Name"
							icon="person"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
						<Textarea
							id="description"
							placeholder="Product Description"
							icon="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							required
						/>
						<InputCurrencyRange
							minPlaceholder="Price"
							maxPlaceholder="Compare Price"
							minValue={price}
							maxValue={priceCompare}
							onMinChange={(value) => setPrice(value)}
							onMaxChange={(value) => setPriceCompare(value)}
							required
						/>
						<InputTags
							value={tags}
							onChange={(value) => setTags(value)}
							placeholder="Enter Tags"
						/>
						<div className="grid grid-cols-5 gap-4">
							{Array.from(Array(10).keys()).map((index) => (
								<ImageInput
									key={index}
									value={base64s[index]}
									onChange={(base64) => imageInputOnClick(index, base64)}
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
						<DialogDescription>
							Make changes to your product details to keep your listing accurate
							and up to date.
						</DialogDescription>
					</DialogHeader>

					<form onSubmit={onUpdateProduct} className="space-y-4">
						<InputText
							type="text"
							id="name"
							placeholder="Product Name"
							icon="inventory_2"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
						<Textarea
							id="description"
							placeholder="Product Description"
							icon="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							required
						/>
						<InputCurrencyRange
							minPlaceholder="Price"
							maxPlaceholder="Compare Price"
							minValue={price}
							maxValue={priceCompare}
							onMinChange={(value) => setPrice(value)}
							onMaxChange={(value) => setPriceCompare(value)}
							required
						/>
						<InputTags
							value={tags}
							onChange={(value) => setTags(value)}
							placeholder="Enter Tags"
						/>
						<div className="grid grid-cols-5 gap-4">
							{Array.from(Array(10).keys()).map((index) => (
								<ImageInput
									key={index}
									value={base64s[index]}
									onChange={(base64) => imageInputOnClick(index, base64)}
								/>
							))}
						</div>

						<DialogFooter>
							<Button type="submit">Update</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</Section>
	);
}
