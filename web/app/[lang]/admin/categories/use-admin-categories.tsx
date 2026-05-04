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
	const { locale } = useI18n();
	const { register, handleSubmit, formState, control, reset } = useForm<{
		name: string;
		slug: string;
		parent?: string | null;
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
			value: category._id,
		}));
	}, [data, locale]);

	const resetForm = () => {
		reset({
			name: undefined,
			parent: undefined,
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
				await adminCategoriesService.updateCategory(row._id, {
					sortOrder: value,
				});

				toast("Category updated.", { position: "top-center" });

				refetch();
			},
			async onActiveChange(value, row) {
				await adminCategoriesService.updateCategory(row._id, {
					isActive: value,
				});

				toast("Category updated.", { position: "top-center" });

				refetch();
			},
			editAction(row) {
				reset({
					...row,
					name: row.name[locale],
					image: {
						url: row.imgUrl,
					},
				});

				setEditDialog(true);
			},
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

		control,
		register,
		formState,
		options,

		categorySubmit: handleSubmit(async (data) => {
			await adminCategoriesService.addCategory({
				name: data.name,
				slug: data.slug,
				parent: data.parent,
				sortOrder: data.sortOrder * 1,
				imgFile: data.image.file,
			});
			setOpen(false);
			categoryTreeRefetch();
			refetch();
		}),
		editCategorySubmit: handleSubmit(async (formData) => {
			const id = data?.find((cat) => cat.slug === formData.slug)?._id || "";

			await adminCategoriesService.updateCategory(id, {
				name: formData.name,
				parent: formData.parent,
				sortOrder: formData.sortOrder * 1,
				imgFile: formData.image.file,
			});
			setEditDialog(false);
			refetch();
		}),
	};
}
