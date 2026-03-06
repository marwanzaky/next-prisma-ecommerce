import { IProduct } from "_shared/interfaces";
import { jsonToFormData } from "./helper";

const baseUrl = process.env.NEXT_PUBLIC_SERVER;

export type IAdminCategory = {
	_id: string;
	name: string;
	slug: string;
	parent?: string;
	sortOrder: number;
	isActive: boolean;
	imgUrl?: string;
};

export type IAddAdminCategory = {
	name: string;
	slug: string;
	parent?: string;
	sortOrder: number;
	image: {
		url?: string;
		file?: File;
	};
};

export const adminCategoriesService = {
	getAllCategories,
	addCategory,
	updateCategory,
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

async function updateCategory(
	id: string,
	token: string,
	payload: {
		name?: string;
		parent?: string;
		image?: File;
		sortOrder?: number;
		isActive?: boolean;
	},
): Promise<IProduct[]> {
	const formData = jsonToFormData(payload);

	const response = await fetch(`${baseUrl}/admin/categories/${id}`, {
		method: "PATCH",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: formData,
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message);
	}

	return data;
}
