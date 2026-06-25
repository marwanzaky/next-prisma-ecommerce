"use client";

import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { useI18n } from "@/components/layout/i18n-provider";
import { DataTable } from "@/components/ui/data-table/data-table";

import { Button } from "@/shadcn/components/ui/button";
import { Heading, TypographyMuted } from "@/shadcn/components/ui/typography";

import { CategoryFormDialog } from "./components/category-form-dialog";
import { useAdminCategories } from "./use-admin-categories";

export default function Page() {
	const {
		columns,
		data,
		isLoading,

		open,
		setOpen,
		openDialog,
		editDialog,
		setEditDialog,

		form,
		options,

		createCategory,
		updateCategory,
	} = useAdminCategories();

	const { t } = useI18n();

	return (
		<Container>
			<Section className="space-y-2 lg:space-y-4">
				<div className="flex justify-center items-center gap-2">
					<Heading as="h4">Your Categories</Heading>
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

				{!isLoading && data && data.length > 0 && (
					<DataTable columns={columns} data={data} />
				)}

				<Button className="block ml-auto" onClick={openDialog}>
					Add category
				</Button>

				<CategoryFormDialog
					title="Create category"
					form={form}
					open={open}
					onOpenChange={setOpen}
					onSubmit={createCategory}
					options={options}
				/>

				<CategoryFormDialog
					title="Edit category"
					form={form}
					open={editDialog}
					onOpenChange={setEditDialog}
					onSubmit={updateCategory}
					options={options}
				/>
			</Section>
		</Container>
	);
}
