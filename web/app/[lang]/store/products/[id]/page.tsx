"use client";

import { useAppSelector } from "@/redux/store";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { ProductBase } from "../product-base";
import { useSell } from "../use-sell";

import { localizePath } from "@/lib/i18n";

import { useI18n } from "@/components/layout/i18n-provider";

export default function Page() {
	const params = useParams<{ id: string }>();
	const router = useRouter();

	const { locale, t } = useI18n();
	const {
		initialConfig,
		form,
		onDescriptionChange,
		options,
		description,
		updateProduct,
		loading,
	} = useSell();

	const { products } = useAppSelector((state) => state.userProductsReducer);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		const product = products.find((p) => p._id === params.id);

		if (product) {
			form.reset({
				name: product.name,
				description: product.description,
				priceRangeUsd: {
					min: product.price / 100,
					max: product.priceCompare / 100,
				},
				tags: product.tags,
				images: product.imgUrls.map((el) => ({ url: el })),
				category: product.category ?? undefined,
			});
		}
	}, [products, params.id, form.reset]);

	return (
		<ProductBase
			initialConfig={initialConfig}
			form={form}
			options={options}
			onDescriptionChange={onDescriptionChange}
			description={description}
			onSubmit={form.handleSubmit((data) =>
				updateProduct({ id: params.id, data }),
			)}
			submitButtonText={t("storeProductsPage.form.update")}
			cancelButtonAction={() =>
				router.push(localizePath("/store/products", locale))
			}
			injectLoadDescriptionPlugin
			loading={loading}
		/>
	);
}
