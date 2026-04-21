"use client";

import { useI18n } from "@/components/layout/i18n-provider";

import { ProductBase } from "../product-base";
import { useSell } from "../use-sell";

export default function Page() {
	const { t } = useI18n();
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
			submitButtonText={t("buttons.save")}
			loading={loading}
		/>
	);
}
