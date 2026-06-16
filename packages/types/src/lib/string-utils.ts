import { Locale } from "@repo/types";

import { intlLocales } from "./i18n";

export function formatPrice(
	amount: number,
	locale: Locale,
	currency = "USD",
): string {
	return new Intl.NumberFormat(intlLocales[locale], {
		style: "currency",
		currency,
	}).format(amount);
}

export function formatDate(date: Date | string): string {
	const value = typeof date === "object" ? date : new Date(date);
	return value.toLocaleDateString("en-us", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}
