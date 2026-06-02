import {
	ProductWithVariantsReviewsUserTranslatedText,
	PublicUser,
	UpdateUser,
	UpdateUserPassword,
} from "@repo/database";

import { clientFetch } from "@/lib/api-client";
import { jsonToFormData } from "@/lib/helper";

export const usersService = {
	getMe: () => clientFetch<PublicUser>("/users/me"),
	getMeProducts: () =>
		clientFetch<ProductWithVariantsReviewsUserTranslatedText[]>(
			"/users/me/products",
		),
	updateMe: (updatedUser: UpdateUser) =>
		clientFetch<PublicUser>("/users/updateMe", {
			method: "PATCH",
			body: jsonToFormData(updatedUser),
		}),
	updateMyPassword: (updateUserPassword: UpdateUserPassword) =>
		clientFetch<{ token: string }>("/users/updateMyPassword", {
			method: "PATCH",
			body: JSON.stringify(updateUserPassword),
		}),
	deleteMe: () =>
		clientFetch<PublicUser>("/users/deleteMe", {
			method: "DELETE",
		}),

	// Users
	getPublicById: (id: string) => clientFetch<PublicUser>(`/users/public/${id}`),
};
