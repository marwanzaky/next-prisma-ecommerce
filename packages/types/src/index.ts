export * from "./lib/i18n";

export * from "./lib/string-utils";

export type TranslatedText = {
	en: string;
	fr: string;
	ar: string;
};

export type Rating = 1 | 2 | 3 | 4 | 5;

export type RatingDistribution = Record<Rating, number>;
