import { usersService } from "@/services/users-service";

import { User } from "@/shared/types/user.type";

import UserProfile from "./user-profile";

interface Props {
	params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
	const { id } = await params;

	const user = await getPublicUser(id);

	return <UserProfile user={user} />;
}

async function getPublicUser(id: string): Promise<User> {
	"use cache";
	return await usersService.getPublicById(id);
}
