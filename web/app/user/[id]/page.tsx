"use client";

import { AvatarInitials } from "@components/feedback/reviews";
import { usersService } from "@redux/services/usersService";
import { User } from "@shared/user.type";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "_shared/components/empty";
import { Section } from "_shared/components/section";

import { IProduct } from "_shared/interfaces";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
	const params = useParams<{ id: string }>();

	const [user, setUser] = useState<User>();
	const [favProducts, setFavProducts] = useState<IProduct>();

	useEffect(() => {
		getPublicUser(params.id).then((value) => setUser(value));
	}, []);

	return (
		user && (
			<Section className="space-y-4">
				<div className="flex justify-between">
					<div className="flex items-center gap-4">
						<AvatarInitials name={user.name} />
						{user.name}
					</div>

					{/* <Button variant="secondary">Follow</Button> */}
				</div>

				<Empty className="border border-dashed">
					<EmptyHeader>
						<EmptyTitle>Nothing here... yet.</EmptyTitle>
						<EmptyDescription className="max-w-xs text-pretty">
							Looks like &quot;{user.name}&quot; hasn&apos;t added any favorite
							items. Check back again later!
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			</Section>
		)
	);
}

async function getPublicUser(id: string): Promise<User> {
	return await usersService.getPublicById(id);
}
