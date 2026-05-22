"use client";

import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { useI18n } from "@/components/layout/i18n-provider";
import { DataTable } from "@/components/ui/data-table/data-table";

import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@/shadcn/components/ui/empty";
import { Heading, TypographyMuted } from "@/shadcn/components/ui/typography";

import { useAdminMessages } from "./use-admin-message";

export default function Page() {
	const { columns, isLoading, data, ViewMessageDialog } = useAdminMessages();

	const { t } = useI18n();
	return (
		<Container>
			<Section className="space-y-2 lg:space-y-4">
				<div className="flex justify-center items-center gap-2">
					<Heading as="h4">Your Messages</Heading>
					{data && (
						<TypographyMuted className="text-sm">
							(
							{(data.length === 1 ? t("item") : t("items")).replace(
								"{{count}}",
								String(data.length),
							)}
							)
						</TypographyMuted>
					)}
				</div>

				{!isLoading && data && data.length > 0 ? (
					<DataTable className="mb-8" columns={columns} data={data} />
				) : (
					<Empty className="border border-dashed">
						<EmptyHeader>
							<EmptyTitle>Nothing here... yet.</EmptyTitle>
							<EmptyDescription className="max-w-xs text-pretty">
								You have no messages
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
				)}

				{ViewMessageDialog}
			</Section>
		</Container>
	);
}
