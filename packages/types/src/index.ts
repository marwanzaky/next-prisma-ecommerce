export const locales = ["en", "fr", "ar"] as const;

export type Locale = (typeof locales)[number];

export type TranslatedText = {
	en: string;
	fr: string;
	ar: string;
};

export type Rating = 1 | 2 | 3 | 4 | 5;

export type RatingDistribution = Record<Rating, number>;
