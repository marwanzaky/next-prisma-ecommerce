"use client";

import { useSell } from "@hooks/use-sell";
import { ProductBase } from "../product-base";

export default function Page() {
	const {
		initialConfig,
		form,
		options,
		onDescriptionChange,
		addProduct,
		description,
	} = useSell();

	return (
		<ProductBase
			initialConfig={initialConfig}
			form={form}
			options={options}
			onDescriptionChange={onDescriptionChange}
			description={description}
			onSubmit={addProduct}
			submitButtonText="Save"
		/>
	);
}
