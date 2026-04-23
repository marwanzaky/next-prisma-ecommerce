"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { StarIcon } from "lucide-react";
import { toast } from "sonner";

import { productsService } from "@/redux/services/products-service";
import { useAppSelector } from "@/redux/store";

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
import { Field, FieldGroup, FieldLabel } from "@/shadcn/components/ui/field";
import { Textarea } from "@/shadcn/components/ui/textarea";
import { Heading } from "@/shadcn/components/ui/typography";
import { TypographyMuted } from "@/shadcn/components/ui/typography";

import { localizePath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import { IProduct } from "@/types/product.type";

export default function Overview({ product }: { product: IProduct }) {
	const router = useRouter();

	const { locale, t } = useI18n();
	const { isAuthenticated } = useAppSelector((state) => state.authReducer);

	const [displayDialog, setDisplayDialog] = useState(false);
	const [rating, setRating] = useState(0);
	const [hoverRating, setHoverRating] = useState(0);
	const [description, setDescription] = useState("");

	return (
		<div className="flex flex-col justify-center">
			<Heading as="h3" variant="h4" className="mx-auto mb-4">
				{t("product.ratingAndReviews")}
			</Heading>

			<div className="grid grid-cols-2 mb-8">
				<div className="flex flex-col items-center justify-center space-y-2">
					<div className="text-5xl font-bold leading-none">
						{product.avgRatings.toFixed(2)}
					</div>
					<Stars value={product.avgRatings} displayTotal={false} />
					<TypographyMuted className="leading-none">
						{t("product.reviewsCount").replace(
							"{{count}}",
							String(product.numReviews),
						)}
					</TypographyMuted>
				</div>

				<ul className="flex flex-col justify-center space-y-2">
					<OverviewRatesLi stars={1} percent="10%" />
					<OverviewRatesLi stars={2} percent="20%" />
					<OverviewRatesLi stars={3} percent="30%" />
					<OverviewRatesLi stars={4} percent="40%" />
					<OverviewRatesLi stars={5} percent="50%" />
				</ul>
			</div>

			<div className="flex justify-center">
				<Dialog open={displayDialog} onOpenChange={setDisplayDialog}>
					<DialogTrigger asChild>
						<Button
							size="lg"
							onClick={(e) => {
								if (!isAuthenticated) {
									e.preventDefault();
									return router.push(localizePath("/signin", locale));
								}
								setRating(0);
							}}
						>
							{t("product.dialog.trigger")}
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[24rem] ">
						<DialogHeader>
							<DialogTitle>{t("product.dialog.title")}</DialogTitle>
							<DialogDescription>
								{t("product.dialog.description")}
							</DialogDescription>
						</DialogHeader>

						<FieldGroup>
							<Field>
								<FieldLabel>{t("product.dialog.rating")}</FieldLabel>
								<div className="flex">
									{[1, 2, 3, 4, 5].map((star) => (
										<button
											className="transition-transform hover:scale-110 "
											key={star}
											onClick={() => setRating(star)}
											onMouseEnter={() => setHoverRating(star)}
											onMouseLeave={() => setHoverRating(0)}
											type="button"
										>
											<StarIcon
												className={cn(
													"h-8 w-8 mr-1 transition-colors",
													(hoverRating || rating) >= star
														? "fill-yellow-400 text-yellow-400"
														: "text-muted-foreground",
												)}
											/>
										</button>
									))}
								</div>
							</Field>
							<Field>
								<FieldLabel id="description">
									{t("product.dialog.feedback")}
								</FieldLabel>
								<Textarea
									id="description"
									placeholder={t("product.dialog.feedbackPlaceholder")}
									className="min-h-32"
									onChange={(e) => setDescription(e.target.value)}
								/>
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
								{t("product.dialog.cancel")}
							</Button>

							<Button
								type="button"
								disabled={rating === 0}
								onClick={async () => {
									await productsService.postProductReview({
										id: product._id,
										rating,
										description,
									});

									setDisplayDialog(false);

									toast(t("product.dialog.successToast"), {
										position: "top-center",
									});
								}}
							>
								{t("product.dialog.submit")}
							</Button>
						</DialogFooter>
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
