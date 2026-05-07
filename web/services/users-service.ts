import type {
	ProductEntity,
	UpdateUser,
	UpdateUserPassword,
	User,
} from "@repo/types";

import { clientFetch } from "@/lib/api-client";
import { jsonToFormData } from "@/lib/helper";

export const usersService = {
	getMe: () => clientFetch<User>("/users/me"),
	getMeProducts: () => clientFetch<ProductEntity[]>("/users/me/products"),
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
