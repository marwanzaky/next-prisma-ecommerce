import { Locale } from "@repo/types";

import { intlLocales } from "@/lib/i18n";

const currency = process.env.NEXT_PUBLIC_CURRENCY || "USD";

export function formatPrice(amount: number, locale: Locale): string {
	const formatted = new Intl.NumberFormat(intlLocales[locale], {
		style: "currency",
		currency,
	}).format(amount);

	if (currency === "MAD") {
		return formatted.replace("MAD", "Dhs");
	}

	return formatted;
}

export function initials(fullName: string): string {
	return fullName
		.split(" ")
		.map((word) => word[0])
		.splice(0, 2)
		.join("")
		.toUpperCase();
}

export function stringToDate(str: string): string {
	const date = new Date(str);
	return date.toLocaleDateString("en-us", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

export function createProductSlug(name: string, id: string): string {
	const slug = name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");

	return `${slug}-${id}`;
}
