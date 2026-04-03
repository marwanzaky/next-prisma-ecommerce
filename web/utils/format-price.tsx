const currency = process.env.NEXT_PUBLIC_CURRENCY || "USD";
const locale = process.env.NEXT_PUBLIC_LOCALE || "en-US";

export function formatCurrency(value: number) {
	const formatted = new Intl.NumberFormat(locale, {
		style: "currency",
		currency,
	}).format(value);

	if (currency === "MAD") {
		return formatted.replace("MAD", "Dhs");
	}

	return formatted;
}
