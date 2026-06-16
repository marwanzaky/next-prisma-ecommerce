export const locales = ["en", "fr", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const rtlLocales: Locale[] = ["ar"];

export const intlLocales: Record<Locale, string> = {
	en: "en-US",
	fr: "fr-FR",
	ar: "ar-MA",
};

export const localeLabels: Record<Locale, string> = {
	en: "English",
	fr: "Francais",
	ar: "العربية",
};
