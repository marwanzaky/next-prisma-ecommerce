"use client";

import { User } from "@repo/types";

import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { useI18n } from "@/components/layout/i18n-provider";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/shadcn/components/ui/avatar";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@/shadcn/components/ui/empty";

import { initials } from "@/lib/string-utils";

export default function UserProfile({ user }: { user: User }) {
	const { t } = useI18n();

	return (
		user && (
			<Container>
				<Section className="space-y-4">
					<div className="flex justify-between">
						<div className="flex items-center gap-4">
							<Avatar className="h-10 w-10">
								<AvatarImage
									src={user.photoUrl}
									alt={t("photoOf").replace("{{name}}", user.name)}
								/>
								<AvatarFallback>{initials(user.name)}</AvatarFallback>
							</Avatar>

							{user.name}
						</div>

						{/* <Button variant="secondary">Follow</Button> */}
					</div>

					<Empty className="border border-dashed">
						<EmptyHeader>
							<EmptyTitle>Nothing here... yet.</EmptyTitle>
							<EmptyDescription className="max-w-xs text-pretty">
								Looks like &quot;{user.name}&quot; hasn&apos;t added any
								favorite items. Check back again later!
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
				</Section>
			</Container>
		)
	);
}
