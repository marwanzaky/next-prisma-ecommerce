"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { toast } from "sonner";

import { useQuery } from "@tanstack/react-query";

import { adminCategoriesService } from "@/services/admin-categories-service";
import { categoriesService } from "@/services/categories-service";

import { useI18n } from "@/components/layout/i18n-provider";

import { getCategoriesColumns } from "./columns";

export function useAdminCategories() {
	const { t, locale } = useI18n();
	const form = useForm<{
		id: string;
		name: string;
		slug: string;
		parentId?: string | null;
		sortOrder: number;
		image: {
			url?: string;
			file?: File;
		};
	}>({
		mode: "onTouched",
	});

	const { data, isLoading, refetch } = useQuery({
		queryKey: ["categories"],
		queryFn: () => adminCategoriesService.getAllCategories(),
		staleTime: 0,
	});

	const { refetch: categoryTreeRefetch } = useQuery({
		queryKey: ["category-tree"],
		queryFn: () => categoriesService.getCategoryTree(),
		staleTime: 1000 * 60 * 5,
	});

	const [open, setOpen] = useState(false);
	const [editDialog, setEditDialog] = useState(false);

	const options = useMemo(() => {
		if (!data) return [];

		return data.map((category) => ({
			label: category.name[locale],
			value: category.id,
		}));
	}, [data, locale]);

	const resetForm = () => {
		form.reset({
			id: undefined,
			name: undefined,
			parentId: undefined,
			slug: undefined,
			sortOrder: undefined,
			image: {
				file: undefined,
				url: undefined,
			},
		});
	};

	return {
		columns: getCategoriesColumns({
			locale,
			categories: data ?? [],
			async onSortChange(value, row) {
				await adminCategoriesService.updateCategory(row.id, {
					sortOrder: value,
				});

				toast("Category updated.", { position: "top-center" });

				refetch();
			},
			async onActiveChange(value, row) {
				await adminCategoriesService.updateCategory(row.id, {
					isActive: value,
				});

				toast("Category updated.", { position: "top-center" });

				refetch();
			},
			editAction(row) {
				form.reset({
					...row,
					name: row.name[locale],
					image: {
						url: row.imgUrl || undefined,
					},
				});

				setEditDialog(true);
			},
			t,
		}),
		data,
		isLoading,

		open,
		setOpen,
		openDialog: () => {
			setOpen(true);
			resetForm();
		},
		editDialog,
		setEditDialog,

		form,
		options,

		createCategory: form.handleSubmit(async (data) => {
			await adminCategoriesService.createCategory({
				name: data.name,
				slug: data.slug,
				parentId: data.parentId ?? null,
				sortOrder: data.sortOrder * 1,
				imgFile: data.image.file,
			});

			setOpen(false);

			categoryTreeRefetch();

			refetch();
		}),
		updateCategory: form.handleSubmit(
			async ({ id, name, parentId, sortOrder, image, slug }) => {
				await adminCategoriesService.updateCategory(id, {
					name,
					slug,
					parentId: parentId ?? null,
					sortOrder: sortOrder * 1,
					imgFile: image.file,
				});

				setEditDialog(false);

				refetch();
			},
		),
	};
}
