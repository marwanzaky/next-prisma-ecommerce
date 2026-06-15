"use client";

import { useI18n } from "@/components/layout/i18n-provider";

import { ProductBase } from "../components/product-base";
import { useSell } from "../use-sell";

export default function Page() {
	const { t } = useI18n();
	const {
		initialConfig,
		form,
		options,
		onDescriptionChange,
		createProduct,
		description,
	} = useSell();

	return (
		<ProductBase
			title="New Product"
			initialConfig={initialConfig}
			form={form}
			options={options}
			onDescriptionChange={onDescriptionChange}
			description={description}
			onSubmit={createProduct}
			submitButtonText={t("buttons.save")}
		/>
	);
}
