"use client";

import { Column, Table } from "_shared/components/table";
import { Section } from "_shared/components/section";
import { TypographyH4, TypographyP } from "_shared/shadcn/typography";
import { useQuery } from "@tanstack/react-query";
import { contactMessagesService } from "@redux/services/contactMessagesService";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "_shared/shadcn/alertDialog";
import { ButtonIcon } from "_shared/ui/buttonIcon";
import { useAppSelector } from "@redux/store";

import { useEffect, useState } from "react";
import { Button } from "_shared/shadcn/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "_shared/shadcn/dialog";
import { InputText } from "_shared/components/inputText";
import { Controller, useForm } from "react-hook-form";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "_shared/shadcn/select";
import {
	adminCategoriesService,
	IAddAdminCategory,
	IAdminCategory,
} from "@redux/services/adminCategoriesService";

export default function Page() {
	const columns: Column<IAdminCategory>[] = [
		{
			header: "Name",
			field: "name",
			type: "text",
		},
		{
			header: "Parent",
			field: "parent",
			type: "text",
		},
		{
			header: "Slug",
			field: "slug",
			type: "text",
		},
		{
			header: "Active",
			field: "isActive",
			type: "custom",
			render: (value, row) => {
				return <div>{row.isActive ? "Yes" : "No"}</div>;
			},
		},
		{
			header: "Sort",
			field: "sortOrder",
			type: "text",
		},
		{
			header: "",
			field: "_id",
			type: "custom",
			width: "38px",
			render(value, row) {
				return (
					<Dialog>
						<DialogTrigger asChild>
							<ButtonIcon icon="edit" />
						</DialogTrigger>

						<DialogContent>
							<DialogHeader>
								<DialogTitle>Edit Category</DialogTitle>
							</DialogHeader>

							<form
								onSubmit={(e) => {
									e.preventDefault();
									refetch();
								}}
								className="space-y-4"
							>
								<InputText
									size="sm"
									placeholder="Category Name"
									value={row.name}
									onChange={() => {}}
								/>
								<InputText
									size="sm"
									placeholder="Category Slug"
									value={row.slug}
									onChange={() => {}}
								/>{" "}
								<InputText
									size="sm"
									placeholder="Category Parent"
									value={row.parent ? row.parent : undefined}
									onChange={() => {}}
								/>
								<InputText
									size="sm"
									placeholder="Category Sort Order"
									type="number"
									value={row.sortOrder}
									onChange={() => {}}
								/>
								<InputText
									size="sm"
									placeholder="Category Sort Order"
									type="checkbox"
									checked={row.isActive}
									onChange={() => {}}
								/>
								<DialogFooter>
									<DialogClose asChild>
										<Button variant="outline">Cancel</Button>
									</DialogClose>

									<Button type="submit">Save</Button>
								</DialogFooter>
							</form>
						</DialogContent>
					</Dialog>
				);
			},
		},
	];

	const { token } = useAppSelector((state) => state.authReducer);

	const { data, isLoading, refetch } = useQuery({
		queryKey: ["categories"],
		queryFn: () => adminCategoriesService.getAllCategories(token),
		staleTime: 0,
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		formState,
		control,
		reset,
		setValue,
	} = useForm<IAddAdminCategory>({
		mode: "onTouched",
	});

	const [open, setOpen] = useState(false);

	const [options, setOptions] = useState<{ label: string; value: string }[]>(
		[],
	);

	useEffect(() => {
		setOptions(() => {
			if (data) {
				return data.map((category) => ({
					label: category.name,
					value: category._id,
				}));
			}
			return [];
		});
	}, [data]);

	return (
		<Section>
			<TypographyH4 className="text-center mb-2 lg:mb-4">
				Your Categories
			</TypographyH4>

			{!isLoading && data && data.length > 0 && (
				<Table className="mb-8" columns={columns} data={data} />
			)}

			<Button
				className="block ml-auto"
				onClick={() => {
					setOpen(true);
				}}
			>
				Add category
			</Button>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Add category</DialogTitle>
					</DialogHeader>

					<form
						onSubmit={handleSubmit((data) => {
							adminCategoriesService.addCategory(token, {
								...data,
								sortOrder: data.sortOrder * 1,
							});
							setOpen(false);
						})}
						className="space-y-4"
					>
						<InputText
							type="text"
							id="name"
							placeholder="Category Name"
							icon="inventory_2"
							message={errors.name?.message}
							{...register("name", {
								required: "This field is required.",
								minLength: { value: 2, message: "Name is too short." },
								maxLength: { value: 64, message: "Name is too long." },
							})}
						/>
						<InputText
							type="text"
							id="slug"
							placeholder="Category Slug"
							icon="inventory_2"
							message={errors.slug?.message}
							{...register("slug", {
								required: "This field is required.",
							})}
						/>

						<div className="flex items-center gap-2">
							<TypographyP className="hidden sm:block whitespace-nowrap">
								Parent:
							</TypographyP>

							<Controller
								name="parent"
								control={control}
								render={({ field }) => (
									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												{options.map((item) => (
													<SelectItem
														key={`select-item-${item.value}`}
														value={item.value}
													>
														{item.label}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
								)}
							/>
						</div>

						<InputText
							type="number"
							id="sortOrder"
							placeholder="Category Sort Order"
							icon="inventory_2"
							message={errors.sortOrder?.message}
							{...register("sortOrder", {
								required: "This field is required.",
							})}
						/>

						<DialogFooter className="gap-2">
							<Button type="submit" disabled={!formState.isDirty}>
								Submit
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</Section>
	);
}
