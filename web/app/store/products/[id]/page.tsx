"use client";

import { useAppSelector } from "@redux/store";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useSell } from "@hooks/use-sell";
import { ProductBase } from "../product-base";

export default function Page() {
	const params = useParams<{ id: string }>();
	const router = useRouter();

	const {
		initialConfig,
		form,
		onDescriptionChange,
		options,
		description,
		updateProduct,
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
			submitButtonText="Update"
			cancelButtonAction={() => router.push("/store/products")}
			injectLoadDescriptionPlugin
		/>
	);
}
