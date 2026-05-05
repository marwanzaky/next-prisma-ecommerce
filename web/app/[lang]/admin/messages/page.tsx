"use client";

import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { Table } from "@/components/ui/table";

import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@/shadcn/components/ui/empty";
import { Heading } from "@/shadcn/components/ui/typography";

import { useAdminMessages } from "./use-admin-message";

export default function Page() {
	const { columns, isLoading, data, ViewMessageDialog } = useAdminMessages();

	return (
		<Container>
			<Section>
				<Heading as="h4" className="text-center mb-2 lg:mb-4">
					Your Messages
				</Heading>

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
		</Container>
	);
}
