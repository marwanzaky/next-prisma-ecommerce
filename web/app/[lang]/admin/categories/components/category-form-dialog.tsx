import { Controller, UseFormReturn } from "react-hook-form";

import { useI18n } from "@/components/layout/i18n-provider";
import ImageInput from "@/components/ui/image-input";

import { Button } from "@/shadcn/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shadcn/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/shadcn/components/ui/field";
import { Input } from "@/shadcn/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shadcn/components/ui/select";
import { Spinner } from "@/shadcn/components/ui/spinner";

import { CategoryInput } from "../use-admin-categories";

export function CategoryFormDialog({
	open,
	onOpenChange,
	title,
	form,
	onSubmit,
	options,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	form: UseFormReturn<CategoryInput>;
	onSubmit: React.SubmitEventHandler<HTMLFormElement>;
	options: { label: string; value: string }[];
}) {
	const {
		formState: { isSubmitting },
		formState,
		control,
		register,
	} = form;

	const { t } = useI18n();

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-104">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>

				<form onSubmit={onSubmit} className="space-y-4">
					<FieldGroup>
						<Field>
							<FieldLabel>Category Image</FieldLabel>
							<Controller
								name="image"
								control={control}
								render={({ field }) => (
									<ImageInput
										className="h-32"
										styleClass="object-cover"
										value={field.value}
										onChange={field.onChange}
									/>
								)}
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="name">Category Name</FieldLabel>
							<Input
								id="name"
								type="text"
								placeholder="e.g. Shoes, Electronics, Home Decor"
								{...register("name", {
									required: "This field is required.",
									minLength: { value: 2, message: "Name is too short." },
									maxLength: { value: 64, message: "Name is too long." },
								})}
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="slug">Category Slug</FieldLabel>
							<Input
								type="text"
								id="slug"
								placeholder="e.g. shoes, electronics, home-decor"
								{...register("slug", {
									required: "This field is required.",
								})}
							/>
						</Field>
						<Field>
							<FieldLabel>Category Parent</FieldLabel>
							<Controller
								name="parentId"
								control={control}
								render={({ field }) => (
									<Select
										value={field.value || ""}
										onValueChange={field.onChange}
									>
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
						</Field>
						<Field>
							<FieldLabel id="sort-order">Category Sort Order</FieldLabel>
							<Input
								id="sort-order"
								type="number"
								min={1}
								{...register("sortOrder", {
									required: "This field is required.",
								})}
							/>
						</Field>
					</FieldGroup>

					<DialogFooter className="gap-2">
						<DialogClose asChild>
							<Button variant="outline">{t("buttons.cancel")}</Button>
						</DialogClose>

						<Button type="submit" disabled={!formState.isDirty || isSubmitting}>
							{isSubmitting ? (
								<>
									<Spinner /> {t("buttons.saving")}
								</>
							) : (
								t("buttons.save")
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
