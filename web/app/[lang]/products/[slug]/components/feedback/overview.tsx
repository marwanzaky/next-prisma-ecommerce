"use client";

import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { StarIcon } from "lucide-react";
import { toast } from "sonner";
import z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { ProductWithReviewsAndUser } from "@repo/database";

import { Rating } from "@repo/types";

import { useAppSelector } from "@/redux/store";

import { productsService } from "@/services/products-service";

import { useI18n } from "@/components/layout/i18n-provider";
import Stars from "@/components/ui/stars";

import { Button } from "@/shadcn/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/shadcn/components/ui/dialog";
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/shadcn/components/ui/field";
import { Spinner } from "@/shadcn/components/ui/spinner";
import { Textarea } from "@/shadcn/components/ui/textarea";
import { Heading } from "@/shadcn/components/ui/typography";
import { TypographyMuted } from "@/shadcn/components/ui/typography";

import { localizePath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export default function Overview({
	product,
}: {
	product: ProductWithReviewsAndUser;
}) {
	const router = useRouter();

	const { locale, t } = useI18n();
	const { isAuthenticated, user } = useAppSelector((state) => state.auth);

	const [displayDialog, setDisplayDialog] = useState(false);
	const [hoverRating, setHoverRating] = useState(0);

	const userLeftReview = useMemo(
		() => !!user && !!product.reviews.find((r) => r.user.id === user.id),
		[product, user],
	);

	const ReviewSchema = z.object({
		rating: z.number().min(1, t("validation.required")),
		description: z.string().optional(),
	});

	type ReviewInput = z.infer<typeof ReviewSchema>;

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
		formState,
		control,
	} = useForm<ReviewInput>({
		resolver: zodResolver(ReviewSchema),
		mode: "onSubmit",
		defaultValues: {
			rating: 0,
			description: undefined,
		},
	});

	const calculatePercentage = (starRating: Rating): string => {
		if (!product.ratingDistribution || product.numReviews === 0) {
			return "0%";
		}

		const count = product.ratingDistribution[starRating] || 0;
		const percentage = (count / product.numReviews) * 100;
		return `${Math.round(percentage)}%`;
	};

	return (
		<div className="flex flex-col justify-center">
			<Heading as="h3" variant="h4" className="mx-auto mb-4">
				{t("productPage.ratingAndReviews")}
			</Heading>

			<div className="grid grid-cols-2 mb-8">
				<div className="flex flex-col items-center justify-center space-y-2">
					<div className="text-5xl font-bold leading-none">
						{product.avgRatings.toFixed(2)}
					</div>
					<Stars value={product.avgRatings} displayTotal={false} />
					<TypographyMuted className="leading-none">
						{t("productPage.reviewsCount").replace(
							"{{count}}",
							String(product.numReviews),
						)}
					</TypographyMuted>
				</div>

				<ul className="flex flex-col justify-center space-y-2">
					<OverviewRatesLi stars={1} percent={calculatePercentage(1)} />
					<OverviewRatesLi stars={2} percent={calculatePercentage(2)} />
					<OverviewRatesLi stars={3} percent={calculatePercentage(3)} />
					<OverviewRatesLi stars={4} percent={calculatePercentage(4)} />
					<OverviewRatesLi stars={5} percent={calculatePercentage(5)} />
				</ul>
			</div>

			<div className="flex justify-center">
				<Dialog open={displayDialog} onOpenChange={setDisplayDialog}>
					<DialogTrigger asChild disabled={userLeftReview}>
						<Button
							size="lg"
							onClick={(e) => {
								if (!isAuthenticated) {
									e.preventDefault();
									return router.push(localizePath("/signin", locale));
								}

								reset({
									rating: 0,
									description: undefined,
								});
							}}
						>
							{t("productPage.dialog.trigger")}
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[24rem] ">
						<DialogHeader>
							<DialogTitle>{t("productPage.dialog.title")}</DialogTitle>
							<DialogDescription>
								{t("productPage.dialog.description")}
							</DialogDescription>
						</DialogHeader>

						<form
							onSubmit={handleSubmit(async ({ rating, description }) => {
								await productsService.postProductReview({
									id: product.id,
									rating,
									description,
								});

								setDisplayDialog(false);

								toast(t("productPage.dialog.successToast"), {
									position: "top-center",
								});
							})}
						>
							<FieldGroup>
								<Field>
									<FieldLabel>{t("productPage.dialog.rating")}</FieldLabel>
									<Controller
										name="rating"
										control={control}
										render={({ field }) => {
											return (
												<div className="flex">
													{[1, 2, 3, 4, 5].map((star) => (
														<button
															className="transition-transform hover:scale-110 "
															key={star}
															onClick={() => field.onChange(star)}
															onMouseEnter={() => setHoverRating(star)}
															onMouseLeave={() => setHoverRating(0)}
															type="button"
														>
															<StarIcon
																className={cn(
																	"h-8 w-8 mr-1 transition-colors",
																	(hoverRating || field.value) >= star
																		? "fill-yellow-400 text-yellow-400"
																		: "text-muted-foreground",
																)}
															/>
														</button>
													))}
												</div>
											);
										}}
									/>
									<FieldError>{errors.rating?.message}</FieldError>
								</Field>
								<Field>
									<FieldLabel id="description">
										{t("productPage.dialog.feedback")}
									</FieldLabel>
									<FieldContent>
										<Textarea
											id="description"
											placeholder={t("productPage.dialog.feedbackPlaceholder")}
											className="min-h-32"
											{...register("description")}
										/>
									</FieldContent>
								</Field>
							</FieldGroup>

							<DialogFooter>
								<Button
									variant="outline"
									type="button"
									onClick={() => {
										setDisplayDialog(false);
									}}
								>
									{t("productPage.dialog.cancel")}
								</Button>

								<Button
									type="submit"
									disabled={!formState.isDirty || isSubmitting}
								>
									{isSubmitting ? (
										<>
											<Spinner /> {t("buttons.submitting")}
										</>
									) : (
										t("buttons.submit")
									)}
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}

function OverviewRatesLi({
	stars,
	percent,
}: {
	stars: number;
	percent: string;
}) {
	return (
		<li className="flex items-center">
			<div className="w-2.5 text-primary leading-none">★</div>
			<div className="w-12.5 text-center leading-none">{stars}</div>
			<div className="h-0.5 w-full bg-border">
				<div className="h-full bg-primary" style={{ width: percent }} />
			</div>
		</li>
	);
}
