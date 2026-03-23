export type UserRole = "user" | "admin";

export type User = {
	_id: string;
	role: UserRole;

	/**
	 * User's full name
	 */
	name: string;
	email: string;

	updatedAt: string;
	createdAt: string;

	photoUrl?: string;
};

export type CreateUser = {
	name: string;
	email: string;
	password: string;
};

export type UpdateUser = Partial<Pick<User, "name" | "email" | "photoUrl">>;

export type UpdateUserPassword = {
	currentPassword: string;
	newPassword: string;
};
