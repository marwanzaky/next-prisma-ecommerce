"use client";

import { createContext, useContext, useMemo } from "react";

import { Locale } from "@repo/types";

import { getDirection } from "@/lib/i18n";

import { Dictionary, DictionaryKeys, DictionaryValue } from "@/types/i18n.type";

type I18nContextValue = {
	dictionary: Dictionary;
	locale: Locale;
	dir: "ltr" | "rtl";
	t: (key: DictionaryKeys, fallback?: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
	children,
	dictionary,
	locale,
}: {
	children: React.ReactNode;
	dictionary: Dictionary;
	locale: Locale;
}) {
	const value = useMemo<I18nContextValue>(() => {
		const dir = getDirection(locale);

		return {
			dictionary,
			locale,
			dir,
			t: (key, fallback) => {
				const value = getValue(dictionary, key);
				return typeof value === "string" ? value : (fallback ?? key);
			},
		};
	}, [dictionary, locale]);

	return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
	const context = useContext(I18nContext);

	if (!context) {
		throw new Error("useI18n must be used within an I18nProvider.");
	}

	return context;
}

function getValue(
	dictionary: Dictionary,
	key: DictionaryKeys,
): DictionaryValue | undefined {
	return key.split(".").reduce<DictionaryValue | undefined>((acc, part) => {
		if (!acc || typeof acc === "string" || Array.isArray(acc)) {
			return undefined;
		}

		return acc[part];
	}, dictionary);
}
