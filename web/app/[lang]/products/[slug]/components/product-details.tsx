"use client";

import { useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { Heart, ShoppingCart } from "lucide-react";

import { ProductVariant, ProductWithVariantsReviewsUser } from "@repo/database";

import { TranslatedText } from "@repo/types";

import { useI18n } from "@/components/layout/i18n-provider";
import InputWithPlusMinusButtons from "@/components/ui/input-with-plus-minus-buttons";
import Stars from "@/components/ui/stars";

import { Badge } from "@/shadcn/components/ui/badge";
import { Button } from "@/shadcn/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/shadcn/components/ui/field";
import { Separator } from "@/shadcn/components/ui/separator";
import { Spinner } from "@/shadcn/components/ui/spinner";
import { TypographyMuted } from "@/shadcn/components/ui/typography";

import { localizePath } from "@/lib/i18n";
import { formatPrice, optionColorToHex, OptionValue } from "@/lib/string-utils";
import { cn } from "@/lib/utils";

import { useCart } from "@/hooks/use-cart";
import { useToggleFavorite } from "@/hooks/use-toggle-favorite";

import ProductAccordions from "./product-accordions";
import ProductBreadcrumb from "./product-breadcrumb";

export function selectedProductVariant(
	product: ProductWithVariantsReviewsUser,
	selectedOptions: Record<string, string>,
) {
	return product.variants.find((variant) =>
		variant.selections.every(
			(selection) =>
				selectedOptions[selection.optionId] === selection.optionValueId,
		),
	);
}

export default function ProductDetails({
	product,
	selectedVariant,
	selectedOptions,
	setSelectedOptions,
}: {
	product: ProductWithVariantsReviewsUser;
	selectedVariant: ProductVariant;
	selectedOptions: Record<string, string>;
	setSelectedOptions: React.Dispatch<
		React.SetStateAction<Record<string, string>>
	>;
}) {
	const router = useRouter();
	const { locale, t } = useI18n();

	const { isFavorite, addToFavorites, removeFromFavorites } =
		useToggleFavorite(product);

	const { addToCart, addToCartLoading } = useCart();

	const [quantity, setQuantity] = useState(1);

	const discount = useMemo(() => {
		const discount = selectedVariant.compareAtPrice - selectedVariant.price;
		const discountPercent = (discount / selectedVariant.compareAtPrice) * 100;
		return `${Math.round(discountPercent)}%`;
	}, [selectedVariant]);

	return (
		<div className="space-y-4 lg:space-y-8">
			<div className="space-y-4">
				<ProductBreadcrumb product={product} />

				<div className="space-y-1 lg:space-y-2">
					<h1 className="scroll-m-20 text-4xl tracking-tight lg:text-5xl">
						{(product.name as TranslatedText)[locale]}
					</h1>

					<div className="flex items-center gap-3 overflow-hidden">
						<div className="text-4xl">
							{formatPrice(selectedVariant.price / 100, locale)}
						</div>

						{selectedVariant.compareAtPrice > selectedVariant.price && (
							<div className="text-muted-foreground line-through text-2xl">
								{formatPrice(selectedVariant.compareAtPrice / 100, locale)}
							</div>
						)}

						{discount !== "0%" && (
							<Badge className="bg-green-600/10 text-green-600">
								{discount} {t("productPage.discountOff")}
							</Badge>
						)}
					</div>

					{product.options.length > 0 && (
						<FieldGroup>
							{product.options.map((option) => (
								<Field key={option.id}>
									<div className="flex justify-between">
										<FieldLabel>{option.name}</FieldLabel>
										<TypographyMuted className="text-sm">
											{
												option.values.find(
													(value) =>
														value.id === selectedOptions[value.optionId],
												)?.value
											}
										</TypographyMuted>
									</div>

									<div className="flex flex-wrap gap-2">
										{option.values.map((value, i) => {
											const isSelected =
												selectedOptions[option.id] === value.id;

											const matchingVariant = selectedProductVariant(product, {
												...selectedOptions,
												[option.id]: value.id,
											});

											const isAvailable =
												!!matchingVariant && matchingVariant.stock > 0;

											const isPurchasable = true;

											const selectOption = () =>
												setSelectedOptions((prev) => ({
													...prev,
													[option.id]: value.id,
												}));

											return option.name === "Color" ? (
												<button
													type="button"
													key={`button-option-${value.optionId}-${i}`}
													onClick={selectOption}
													disabled={!isAvailable}
													title={value.value}
													style={{
														backgroundColor: optionColorToHex(
															value.value as OptionValue,
														),
													}}
													className={cn(
														"w-10 h-10 rounded-lg border transition-all relative overflow-hidden",
														isSelected
															? "border-gray-900 ring-2 ring-primary ring-offset-2"
															: "border-gray-200",
														!isAvailable
															? "opacity-30 cursor-not-allowed"
															: "cursor-pointer",
													)}
												>
													{!isPurchasable && isAvailable && (
														<span className="absolute inset-0 flex items-center justify-center">
															<span className="w-full h-0.5 bg-gray-400 rotate-45 absolute" />
														</span>
													)}
												</button>
											) : (
												<Button
													type="button"
													key={`button-option-${value.optionId}-${i}`}
													variant="outline"
													onClick={selectOption}
													disabled={!isAvailable}
													className={
														isSelected
															? "ring-2 ring-primary ring-offset-2 border-primary"
															: ""
													}
												>
													{value.value}
													{!isPurchasable && isAvailable && (
														<span className="ml-1 text-xs text-gray-400">
															Out Of Stock
														</span>
													)}
												</Button>
											);
										})}
									</div>
								</Field>
							))}

							{selectedVariant === undefined && (
								<FieldError>
									Selected option combination is not available.
								</FieldError>
							)}
						</FieldGroup>
					)}

					<Stars value={product.avgRatings} total={product.numReviews} />

					<div className="text-sm text-muted-foreground">
						{selectedVariant.stock > 0
							? `In stock: ${selectedVariant.stock}`
							: "Out of stock"}
					</div>
				</div>
			</div>

			<Separator />

			<div className="space-y-2 flex flex-col">
				<div className="flex gap-2">
					<InputWithPlusMinusButtons
						className="w-30"
						min={1}
						max={10}
						value={quantity}
						onChange={setQuantity}
					/>
					<Button
						size="xl"
						className="flex-1"
						onClick={() => {
							addToCart(product, selectedVariant, quantity);
						}}
						disabled={addToCartLoading}
					>
						{addToCartLoading ? <Spinner /> : <ShoppingCart />}
						{t("productPage.actions.addToCart")}
					</Button>

					{isFavorite ? (
						<Button
							size="xl"
							variant="outline"
							aria-label={t("productPage.actions.removeFromFavorites")}
							onClick={removeFromFavorites}
						>
							<Heart fill="currentColor" className="text-primary" />
						</Button>
					) : (
						<Button
							size="xl"
							variant="outline"
							aria-label={t("productPage.actions.addToFavorites")}
							onClick={addToFavorites}
						>
							<Heart />
						</Button>
					)}
				</div>

				<Button
					size="xl"
					variant="secondary"
					onClick={() => {
						addToCart(product, selectedVariant, quantity);

						router.push(localizePath("/cart", locale));
					}}
				>
					{t("productPage.actions.buyNow")}
				</Button>
			</div>

			<ProductAccordions product={product} />
		</div>
	);
}
