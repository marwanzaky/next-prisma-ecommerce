"use client";

import { ProductBase } from "../product-base";
import { useSell } from "../use-sell";

export default function Page() {
	const {
		initialConfig,
		form,
		options,
		onDescriptionChange,
		addProduct,
		description,
		loading,
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
			loading={loading}
		/>
	);
}
