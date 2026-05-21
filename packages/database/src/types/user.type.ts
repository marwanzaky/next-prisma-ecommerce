import { Prisma, User } from "../../generated/prisma/client";

export const userPublicSelect: Prisma.UserSelect = {
	id: true,
	role: true,
	name: true,
	email: true,
	avatarUrl: true,
};

const publicUser = {
	select: userPublicSelect,
} satisfies Prisma.UserDefaultArgs;

export type PublicUser = Prisma.UserGetPayload<typeof publicUser>;

export type UpdateUser = Partial<Pick<User, "name" | "email">> & {
	avatarFile?: File;
};

export type CreateUser = {
	name: string;
	email: string;
	password: string;
};

export type UpdateUserPassword = {
	currentPassword: string;
	newPassword: string;
};

export type Login = {
	email: string;
	password: string;
};

export type SignUp = CreateUser;

export type ResetPassword = {
	newPassword: string;
};

export type ForgotPassword = {
	email: string;
};
