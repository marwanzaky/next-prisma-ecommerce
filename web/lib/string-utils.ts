import { formatPrice as formatPriceFun, Locale } from "@repo/types";

const currency = process.env.NEXT_PUBLIC_CURRENCY || "USD";

export function formatPrice(amount: number, locale: Locale): string {
	return formatPriceFun(amount, locale, currency);
}

export function initials(fullName: string): string {
	return fullName
		.split(" ")
		.map((word) => word[0])
		.splice(0, 2)
		.join("")
		.toUpperCase();
}

export function createProductSlug(name: string, id: string): string {
	const slug = name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");

	return `${slug}-${id}`;
}

export type OptionValue =
	| "Black"
	| "White"
	| "Navy"
	| "Cranberry"
	| "Pink"
	| "Stone"
	| "Dark Gray"
	| "Grey"
	| "Forest Green"
	| "Brown"
	| "Beige"
	| "Red"
	| "Blue";

export function optionColorToHex(value: OptionValue): string {
	switch (value) {
		case "White":
			return "#fff";
		case "Black":
			return "#000";
		case "Navy":
			return "#000080";
		case "Cranberry":
			return "#A60A3D";
		case "Pink":
			return "#FFC0CB";
		case "Stone":
			return "#ADA587";
		case "Dark Gray":
			return "#A9A9A9";
		case "Grey":
			return "#808080";
		case "Forest Green":
			return "#228B22";
		case "Brown":
			return "#964B00";
		case "Beige":
			return "#F5F5DC";
		case "Red":
			return "#FF0000";
		case "Blue":
			return "#0000FF";
	}
}
