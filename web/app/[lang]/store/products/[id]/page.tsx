"use client";

import { useCallback, useEffect } from "react";

import { useParams } from "next/navigation";

import { useAppSelector } from "@/redux/store";

import { useI18n } from "@/components/layout/i18n-provider";

import { ProductBase } from "../product-base";
import { useSell } from "../use-sell";

export default function Page() {
	const params = useParams<{ id: string }>();

	const { t } = useI18n();
	const {
		initialConfig,
		form,
		onDescriptionChange,
		options,
		description,
		updateProduct,
		loading,
	} = useSell();

	const { products } = useAppSelector((state) => state.userProducts);

	const resetForm = useCallback(() => {
		const product = products.find((p) => p.id === params.id);

		if (product) {
			form.reset({
				name: product.name.en,
				description: product.description.en,
				tags: product.tags,
				options: product.options.map((option) => ({
					name: option.name,
					values: option.values.map((value) => value.value),
				})),
				variants: product.variants.map((variant) => ({
					variantId: variant.id,
					title: variant.title || "",
					price: variant.price,
					selections: variant.selections.map((selection) => ({
						optionName: selection.option.name,
						optionValue: selection.optionValue.value,
					})),
					sku: variant.sku ?? "",
					stock: variant.stock,
					images: Array.from({ length: 10 }, (_, i) => {
						const el = variant.imgUrls[i];
						return el ? { url: el } : undefined;
					}),
				})),
				categoryId: product.categoryId ?? undefined,
			});
		}
	}, [products, params.id, form]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		resetForm();
	}, [resetForm]);

	return (
		<ProductBase
			productId={products.find((p) => p.id === params.id)!.id}
			title={products.find((p) => p.id === params.id)!.name["en"]}
			initialConfig={initialConfig}
			form={form}
			options={options}
			onDescriptionChange={onDescriptionChange}
			description={description}
			onSubmit={form.handleSubmit((data) => {
				updateProduct({ id: params.id, data });
			})}
			submitButtonText={t("buttons.update")}
			cancelButtonAction={resetForm}
			injectLoadDescriptionPlugin
			loading={loading}
		/>
	);
}
