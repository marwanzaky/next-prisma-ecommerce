import { useEffect, useMemo } from "react";
import { useFieldArray, UseFormReturn, useWatch } from "react-hook-form";

import { createVariant, syncAndGenerateVariants } from "@/lib/variants";

import { ProductInput } from "../use-sell";

export function useStoreProducts({
	productId,
	title,
	form,
}: {
	productId?: string;
	title: string;
	form: UseFormReturn<ProductInput>;
}) {
	const { replace: replaceVariants } = useFieldArray({
		control: form.control,
		name: "variants",
	});

	const optionsWatch = useWatch({ control: form.control, name: "options" });
	const nameWatch = useWatch({ control: form.control, name: "name" });
	const variantsWatch = useWatch({ control: form.control, name: "variants" });

	const hasVariants = useMemo(() => variantsWatch.length > 1, [variantsWatch]);

	useEffect(() => {
		const currentVariants = form.getValues("variants");

		let updatedVariants: ProductInput["variants"] = [];

		const activeOptions = (optionsWatch || []).filter(
			(opt) => opt && opt.name && opt.values?.length > 0,
		);
		const baseSku = nameWatch.split(" ").slice(0, 3).join("-");

		if (activeOptions.length > 0) {
			updatedVariants = syncAndGenerateVariants(
				optionsWatch,
				currentVariants,
				baseSku,
			);
		} else {
			const hasBaseProduct =
				currentVariants.length === 1 &&
				currentVariants[0].selections.length === 0;

			if (hasBaseProduct) {
				return;
			}

			updatedVariants = [
				createVariant({
					title: nameWatch || title,
					baseSku: `${baseSku}-${productId}`,
					selections: [],
				}),
			];
		}

		replaceVariants(updatedVariants);
	}, [optionsWatch, replaceVariants, nameWatch]);

	return {
		variantsWatch,
		hasVariants,
	};
}
