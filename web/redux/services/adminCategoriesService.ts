import { IProduct } from "_shared/interfaces";

const baseUrl = process.env.NEXT_PUBLIC_SERVER;

export type IAdminCategory = {
	_id: string;
	name: string;
	slug: string;
	parent?: string;
	sortOrder: number;
	isActive: boolean;
};

export type IAddAdminCategory = {
	name: string;
	slug: string;
	parent?: string;
	sortOrder: number;
};

export const adminCategoriesService = {
	getAllCategories,
	addCategory,
};

async function getAllCategories(token: string): Promise<IAdminCategory[]> {
	const response = await fetch(`${baseUrl}/admin/categories`, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-type": "application/json",
		},
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message);
	}

	return data;
}

async function addCategory(
	token: string,
	payload: IAddAdminCategory,
): Promise<IProduct[]> {
	const response = await fetch(`${baseUrl}/admin/categories`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message);
	}

	return data;
}
