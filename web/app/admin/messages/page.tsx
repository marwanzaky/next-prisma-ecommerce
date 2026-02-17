"use client";

import { Table } from "_shared/components/table";
import { Section } from "_shared/components/section";
import { TypographyH4 } from "_shared/shadcn/typography";

import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "_shared/components/empty";
import { useAdminMessages } from "@hooks/useAdminMessage";

export default function Page() {
	const { columns, isLoading, data, ViewMessageDialog } = useAdminMessages();

	return (
		<Section>
			<TypographyH4 className="text-center mb-2 lg:mb-4">
				Your Messages
			</TypographyH4>

			{!isLoading && data && data.length > 0 ? (
				<Table className="mb-8" columns={columns} data={data} />
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
	);
}
