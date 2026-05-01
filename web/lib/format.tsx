import { intlLocales, Locale } from "@/lib/i18n";

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
