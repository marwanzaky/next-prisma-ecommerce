import { EntityBase } from "./entity.type";

export type ReviewEntity = EntityBase & {
	rating: number;
	description?: string;
	product: string;
	user: string;
};
