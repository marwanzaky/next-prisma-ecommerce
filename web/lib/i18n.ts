import { Locale, locales } from "@repo/types";

import config from "./config";

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

export function hasLocale(maybeLocale: string) {
	return locales.includes(maybeLocale as Locale);
}

export function getDirection(locale: Locale) {
	return rtlLocales.includes(locale) ? "rtl" : "ltr";
}

export function stripLocaleFromPathname(pathname: string) {
	const parts = pathname.split("/");
	const maybeLocale = parts[1];

	if (maybeLocale && hasLocale(maybeLocale)) {
		const stripped = `/${parts.slice(2).join("/")}`;
		return stripped === "/" ? "/" : stripped.replace(/\/+$/, "") || "/";
	}

	return pathname || "/";
}

export function localizePath(pathname: string, locale: Locale) {
	const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
	const strippedPath = stripLocaleFromPathname(normalizedPath);

	return strippedPath === "/" ? `/${locale}` : `/${locale}${strippedPath}`;
}

export function localizeUrl(pathname: string, locale: Locale) {
	return `${config.clientUrl}/${locale}${pathname === "/" ? "" : pathname}`;
}
