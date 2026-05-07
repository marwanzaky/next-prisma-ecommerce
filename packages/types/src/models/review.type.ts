import { EntityBase } from "./entity.type.js";
import { TranslatedText } from "./product.types.js";

export type ReviewEntity = EntityBase & {
	rating: number;
	description?: TranslatedText;
	product: string;
	user: string;
};
