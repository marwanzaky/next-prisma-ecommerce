export type UserRole = "user" | "admin";

export type User = {
	_id: string;
	role: UserRole;

	/**
	 * User's full name
	 */
	name: string;
	email: string;

	/**
	 * base64
	 */
	photo?: string | null;
};

export type CreateUser = {
	name: string;
	email: string;
	password: string;
};

export type UpdateUser = Partial<Pick<User, "name" | "email" | "photo">>;

export type UpdateUserPassword = {
	currentPassword: string;
	newPassword: string;
};
