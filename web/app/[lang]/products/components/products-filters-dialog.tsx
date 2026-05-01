"use client";

import { StarIcon } from "lucide-react";

import { useI18n } from "@/components/layout/i18n-provider";
import { InputCurrencyRange } from "@/components/ui/input-currency-range";

import { Button } from "@/shadcn/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/shadcn/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/shadcn/components/ui/field";
import { Input } from "@/shadcn/components/ui/input";
import { Label } from "@/shadcn/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shadcn/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shadcn/components/ui/select";

import { useProductsContext } from "./products-context";

export default function ProductsFiltersDialog() {
	const { locale, t } = useI18n();

	const {
		categories,

		visible,
		setVisible,

		draftName,
		setDraftName,
		draftCategory,
		setDraftCategory,
		draftMinPrice,
		setDraftMinPrice,
		draftMaxPrice,
		setDraftMaxPrice,
		draftRating,
		setDraftRating,

		cancelFilters,
		applyFilters,
		openFilterDialog,
	} = useProductsContext();

	return (
		<Dialog open={visible} onOpenChange={setVisible}>
			<DialogTrigger
				asChild
				onClick={(e) => {
					e.preventDefault();
					openFilterDialog();
				}}
			>
				<Button variant="outline">{t("productsPage.allFilters")}</Button>
			</DialogTrigger>
			<DialogContent
				className="sm:max-w-sm"
				onSubmit={(e) => {
					e.preventDefault();
					applyFilters();
				}}
			>
				<DialogHeader>
					<DialogTitle>{t("productsPage.filters")}</DialogTitle>
				</DialogHeader>

				<form>
					<FieldGroup>
						<Field>
							<FieldLabel>{t("productsPage.category")}</FieldLabel>
							<Select
								value={draftCategory}
								onValueChange={(value) => setDraftCategory(value)}
							>
								<SelectTrigger>
									<SelectValue placeholder={t("productsPage.selectCategory")} />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{categories?.map((cat) => (
											<SelectItem
												key={`select-item-${cat.slug}`}
												value={cat.slug}
											>
												{cat.name[locale]}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</Field>
						<Field>
							<FieldLabel htmlFor="name">{t("productsPage.name")}</FieldLabel>
							<Input
								id="name"
								placeholder={t("productsPage.namePlaceholder")}
								value={draftName || ""}
								onChange={(event) => setDraftName(event.target.value)}
							/>
						</Field>
						<Field>
							<FieldLabel>{t("productsPage.priceRange")}</FieldLabel>
							<InputCurrencyRange
								minValue={draftMinPrice}
								maxValue={draftMaxPrice}
								onMinChange={(value) => setDraftMinPrice(value)}
								onMaxChange={(value) => setDraftMaxPrice(value)}
							/>
						</Field>
						<Field className="mb-4">
							<FieldLabel>{t("productsPage.rating")}</FieldLabel>
							<RadioGroup
								className="gap-1"
								value={draftRating?.toString()}
								onValueChange={(value) => {
									setDraftRating(parseInt(value));
								}}
							>
								<div className="flex items-center gap-2">
									<RadioGroupItem value="5" id="option-5" />
									<Label className="gap-0.5" htmlFor="option-5">
										{[1, 2, 3, 4, 5].map((star) => (
											<StarIcon
												key={`star-${star}`}
												className={"h-4 w-4 fill-yellow-400 text-yellow-400"}
											/>
										))}
									</Label>
								</div>
								<div className="flex items-center gap-2">
									<RadioGroupItem value="4" id="option-4" />
									<Label className="gap-0.5" htmlFor="option-4">
										{[1, 2, 3, 4].map((star) => (
											<StarIcon
												key={`star-${star}`}
												className={"h-4 w-4 fill-yellow-400 text-yellow-400"}
											/>
										))}
									</Label>
								</div>

								<div className="flex items-center gap-2">
									<RadioGroupItem value="3" id="option-3" />
									<Label className="gap-0.5" htmlFor="option-3">
										{[1, 2, 3].map((star) => (
											<StarIcon
												key={`star-${star}`}
												className={"h-4 w-4 fill-yellow-400 text-yellow-400"}
											/>
										))}
									</Label>
								</div>

								<div className="flex items-center gap-2">
									<RadioGroupItem value="2" id="option-2" />
									<Label className="gap-0.5" htmlFor="option-2">
										{[1, 2].map((star) => (
											<StarIcon
												key={`star-${star}`}
												className={"h-4 w-4 fill-yellow-400 text-yellow-400"}
											/>
										))}
									</Label>
								</div>

								<div className="flex items-center gap-2">
									<RadioGroupItem value="1" id="option-1" />
									<Label htmlFor="option-1">
										<StarIcon
											className={"h-4 w-4 fill-yellow-400 text-yellow-400"}
										/>
									</Label>
								</div>
							</RadioGroup>
						</Field>
					</FieldGroup>

					<DialogFooter>
						<Button variant="outline" type="button" onClick={cancelFilters}>
							{t("buttons.cancel")}
						</Button>

						<Button type="submit">{t("productsPage.applyFilter")}</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
