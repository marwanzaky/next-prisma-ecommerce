import { VariantInput } from "@/app/[lang]/store/products/[id]/variants/[variantId]/page";
import { ProductInput } from "@/app/[lang]/store/products/use-sell";

export function slugify(text: string): string {
	return text
		.toString()
		.toUpperCase()
		.trim()
		.replace(/\s+/g, "-")
		.replace(/[^\w\-]+/g, "")
		.replace(/\-\-+/g, "-");
}

export function syncAndGenerateVariants(
	options: ProductInput["options"],
	currentVariants: ProductInput["variants"],
	baseSku: string,
): ProductInput["variants"] {
	// 1. Filter out incomplete entries
	const validOptions = options.filter(
		(opt) => opt.name && opt.values.length > 0,
	);
	if (validOptions.length === 0) return [];

	// 2. Compute the Cartesian Product Matrix
	const cartesian = (acc: any[][], curr: string[]): any[][] =>
		acc.flatMap((c) => curr.map((n) => [...c, n]));

	const valueGroups = validOptions.map((opt) => opt.values);
	const combinations = valueGroups.reduce(cartesian, [[]]) as string[][];

	// 3. Create a Set of valid mathematical signature strings for quick lookup
	const generatedSignatures = new Set<string>();

	const targetCombinations = combinations.map((combination) => {
		const selections = combination.map((val, index) => ({
			optionName: validOptions[index].name,
			optionValue: val,
		}));

		const signature = selections
			.map((s) => `${s.optionName}:${s.optionValue}`)
			.sort()
			.join("|");

		generatedSignatures.add(signature);

		return { title: combination.join(" / "), selections, signature };
	});

	// 4. PRESERVE ORDER: Filter out current variants that are still valid mathematically
	const preservedVariants: ProductInput["variants"] = currentVariants.filter(
		(variant) => {
			const variantSignature = variant.selections
				.map((s) => `${s.optionName}:${s.optionValue}`)
				.sort()
				.join("|");
			return generatedSignatures.has(variantSignature);
		},
	);

	// 5. APPEND NEW ENTRIES: Find combinations that aren't present in current state
	const currentSignatures = new Set(
		currentVariants.map((v) =>
			v.selections
				.map((s) => `${s.optionName}:${s.optionValue}`)
				.sort()
				.join("|"),
		),
	);

	const newVariants: ProductInput["variants"] = targetCombinations
		.filter((combo) => !currentSignatures.has(combo.signature))
		.map((combo) =>
			createVariant({
				title: combo.title,
				baseSku,
				selections: combo.selections,
			}),
		);

	// Combine them: old preserved array layout first (order kept), then newly added combinations
	return [...preservedVariants, ...newVariants];
}

export function generateVariantSKU(
	baseSku: string,
	selections: VariantInput["selections"],
): string {
	return `${slugify(baseSku)}-${selections.map((s) => slugify(s.optionValue)).join("-")}`;
}

export function createVariant({
	baseSku,
	title,
	selections,
}: {
	baseSku: string;
	title: string;
	selections: VariantInput["selections"];
}): VariantInput {
	return {
		title,
		priceRangeUsd: {
			min: 9.99,
			max: 12.99,
		},
		stock: 1,
		sku: generateVariantSKU(baseSku, selections),
		selections,
		images: Array.from({ length: 10 }, (_, i) => {
			return undefined;
		}),
	};
}
