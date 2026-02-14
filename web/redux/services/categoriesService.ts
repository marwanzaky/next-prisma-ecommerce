import { IProduct } from "_shared/interfaces";

const baseUrl = process.env.NEXT_PUBLIC_SERVER;

export type ICategory = {
	_id: string;
	name: string;
	slug: string;
	parent?: string;
	sortOrder: number;
};

export const categoriesService = {
	getAllCategories,
	getCategoryTree,
};

async function getAllCategories(): Promise<ICategory[]> {
	const response = await fetch(`${baseUrl}/categories`);

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message);
	}

	return data;
}

export type ICategoryTree = {
	_id: string;
	name: string;
	slug: string;
	children: ICategoryTree[];
};

async function getCategoryTree(): Promise<ICategoryTree[]> {
	const response = await fetch(`${baseUrl}/categories/tree`);

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message);
	}

	return data;
}
