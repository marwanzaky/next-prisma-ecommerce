"use client";

import { useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";

import { Trash2 } from "lucide-react";

import { InputTags } from "@/components/ui/input-tags";

import { Badge } from "@/shadcn/components/ui/badge";
import { Button } from "@/shadcn/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/shadcn/components/ui/field";
import { Input } from "@/shadcn/components/ui/input";
import { Separator } from "@/shadcn/components/ui/separator";

import { ProductInput } from "../use-sell";

export function ProductOption({
	form,
	optionIndex,
	onDelete,
}: {
	form: UseFormReturn<ProductInput>;
	optionIndex: number;
	onDelete: () => void;
}) {
	const [edit, setEdit] = useState(false);
	const {
		register,
		control,
		watch,
		formState: { errors },
	} = form;

	const optionName = watch(`options.${optionIndex}.name`);
	const optionValues = watch(`options.${optionIndex}.values`);
	const optionError = errors.options?.[optionIndex];

	return (
		<>
			{edit ? (
				<FieldGroup>
					<Field>
						<FieldLabel htmlFor="option-name">Option name</FieldLabel>
						<Input
							id="option-name"
							placeholder="e.g., Size, Color"
							{...register(`options.${optionIndex}.name`)}
						/>
						<FieldError>{optionError?.name?.message}</FieldError>
					</Field>

					<Field>
						<FieldLabel htmlFor="option-values">Option values</FieldLabel>
						<Controller
							name={`options.${optionIndex}.values`}
							control={control}
							render={({ field }) => (
								<InputTags
									id="option-values"
									placeholder="Press Enter to add tags"
									value={field.value ?? []}
									onChange={field.onChange}
								/>
							)}
						/>
						<FieldError>{optionError?.values?.message}</FieldError>
					</Field>

					<Field orientation="horizontal">
						<Button
							type="button"
							variant="destructive"
							size="sm"
							onClick={onDelete}
						>
							<Trash2 /> Remove option
						</Button>
						<Button type="button" size="sm" onClick={() => setEdit(false)}>
							Done
						</Button>
					</Field>
				</FieldGroup>
			) : (
				<div>
					<div className="flex justify-between items-center">
						<span className="font-medium text-sm">
							{optionName || (
								<span className="italic text-muted-foreground">
									Unnamed Option
								</span>
							)}
						</span>

						<div className="flex gap-1">
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={() => setEdit(true)}
							>
								Edit
							</Button>

							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={onDelete}
							>
								<Trash2 className="text-destructive" />
							</Button>
						</div>
					</div>

					<div className="flex flex-wrap gap-1.5">
						{optionValues.length === 0 ? (
							<span className="text-xs text-muted-foreground italic">
								No values provided
							</span>
						) : (
							optionValues.map((val, idx) => (
								<Badge key={`${val}-${idx}`} variant="secondary">
									{val}
								</Badge>
							))
						)}
					</div>
				</div>
			)}

			<Separator />
		</>
	);
}
