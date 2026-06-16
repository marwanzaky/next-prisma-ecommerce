import { Locale, locales, rtlLocales } from "@repo/types";

import config from "./config";

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
