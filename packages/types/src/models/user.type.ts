import { EntityBase } from "./entity.type";

export type UserRole = "user" | "admin";

export type User = EntityBase & {
	role: UserRole;

	name: string;
	email: string;

	passwordChangedAt: Date;
	passwordResetToken: string | undefined;
	passwordResetExpires: Date | undefined;

	photoUrl?: string;

	isVerified: boolean;
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
