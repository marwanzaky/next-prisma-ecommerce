import { clientFetch } from "@/lib/api-client";

import { jsonToFormData } from "@/utils/helper";

import { IProduct } from "@/types/product.type";
import { UpdateUser, UpdateUserPassword, User } from "@/shared/types/user.type";

export const usersService = {
	login: (email: string, password: string) =>
		clientFetch<{ token: string }>("/auth/login", {
			method: "POST",
			body: JSON.stringify({ email, password }),
		}),
	signup: (name: string, email: string, password: string) =>
		clientFetch<{ token: string }>("/auth/signup", {
			method: "POST",
			body: JSON.stringify({ name, email, password }),
		}),

	// My account
	getMe: () => clientFetch<User>("/users/me"),
	getMeProducts: () => clientFetch<IProduct[]>("/users/me/products"),
	updateMe: (updatedUser: UpdateUser & { photoFile?: File }) =>
		clientFetch<User>("/users/updateMe", {
			method: "PATCH",
			body: jsonToFormData(updatedUser),
		}),
	updateMyPassword: ({ currentPassword, newPassword }: UpdateUserPassword) =>
		clientFetch<{ token: string }>("/users/updateMyPassword", {
			method: "PATCH",
			body: JSON.stringify({ currentPassword, newPassword }),
		}),
	deleteMe: () =>
		clientFetch<User>("/users/deleteMe", {
			method: "DELETE",
		}),

	// Users
	getPublicById: (id: string) => clientFetch<User>(`/users/public/${id}`),
};
