import en from "@/dictionaries/en.json";

type PathsToDotNotation<T, Prefix extends string = ""> = T extends string
	? Prefix
	: {
			[K in keyof T & string]: PathsToDotNotation<
				T[K],
				Prefix extends "" ? K : `${Prefix}.${K}`
			>;
		}[keyof T & string];

export type Dictionary = typeof en;

export type DictionaryKeys = PathsToDotNotation<Dictionary>;

export type DictionaryValue =
	| string
	| {
			[key: string]: DictionaryValue;
	  }
	| DictionaryValue[];
