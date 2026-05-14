import { NextRequest, NextResponse } from "next/server";

import Negotiator from "negotiator";

import { match } from "@formatjs/intl-localematcher";

import { Locale, locales } from "@repo/types";

import { defaultLocale, hasLocale, localizePath } from "@/lib/i18n";

function getPreferredLocale(request: NextRequest): Locale {
	const negotiatorHeaders: Record<string, string> = {};
	request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

	const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

	try {
		return match(languages, locales, defaultLocale) as Locale;
	} catch {
		return defaultLocale;
	}
}

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const [, maybeLocale] = pathname.split("/");

	if (maybeLocale && hasLocale(maybeLocale)) {
		return NextResponse.next();
	}

	if (pathname === "/sitemap.xml" || pathname === "/robots.txt") {
		return NextResponse.next();
	}

	const locale = getPreferredLocale(request);

	const url = request.nextUrl.clone();
	url.pathname = localizePath(pathname, locale);

	return NextResponse.redirect(url);
}

export const config = {
	matcher: ["/((?!_next|api|.*\\..*).*)"],
};
