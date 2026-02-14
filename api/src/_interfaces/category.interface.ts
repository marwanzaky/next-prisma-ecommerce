import { Types } from "mongoose";

export interface ICategory {
	_id: string;
	name: string;
	slug: string;
	parent: Types.ObjectId | null;
	isActive: boolean;
	sortOrder: number;
}

export type ICreateCategory = Omit<ICategory, "_id" | "isActive" | "parent"> & {
	parent: string | null;
};

export type IUpdateCategory = Partial<Omit<ICategory, "_id" | "parent">> & {
	parent?: string | null;
};
