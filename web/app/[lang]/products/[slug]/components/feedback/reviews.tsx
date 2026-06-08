"use client";

import { useMemo } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ProductWithVariantsReviewsUser } from "@repo/database";

import { TranslatedText } from "@repo/types";

import { useI18n } from "@/components/layout/i18n-provider";
import Stars from "@/components/ui/stars";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/shadcn/components/ui/avatar";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@/shadcn/components/ui/empty";
import { TypographyMuted } from "@/shadcn/components/ui/typography";

import { localizePath } from "@/lib/i18n";
import { formatDate, initials } from "@/lib/string-utils";

export default function Reviews({
	product,
}: {
	product: ProductWithVariantsReviewsUser;
}) {
	const { locale, t } = useI18n();
	const router = useRouter();

	const reviews = useMemo(
		() => product.reviews.filter((review) => !!review.description),
		[product],
	);

	return (
		<div>
			{reviews?.length > 0 ? (
				reviews?.map((review, i) => (
					<div key={`review ${i}`} className="mb-8 last:mb-0 flex">
						<Avatar className="me-2 h-8 w-8">
							<AvatarImage
								role="button"
								className="cursor-pointer"
								src={review.user.avatarUrl || undefined}
								alt={t("photoOf").replace("{{name}}", review.user.name)}
								onClick={() =>
									router.push(localizePath(`/user/${review.user.id}`, locale))
								}
								loading="lazy"
							/>
							<AvatarFallback role="button" className="cursor-pointer">
								{initials(review.user.name)}
							</AvatarFallback>
						</Avatar>

						<div>
							<div className="leading-none mb-0.5 text-sm">
								<Link
									href={localizePath(`/user/${review.user.id}`, locale)}
									className="hover:underline"
								>
									{review.user.name}
								</Link>
								&ensp;
								<span className="text-muted-foreground">
									{formatDate(review.createdAt)}
								</span>
							</div>
							<Stars
								className="mb-1"
								size={14}
								value={review.rating}
								displayTotal={false}
							/>
							<TypographyMuted className="text-sm">
								{(review.description as TranslatedText)?.[locale]}
							</TypographyMuted>
						</div>
					</div>
				))
			) : (
				<Empty className="border border-dashed h-full">
					<EmptyHeader>
						<EmptyTitle>{t("productPage.noReviewsTitle")}</EmptyTitle>
						<EmptyDescription className="max-w-xs text-pretty">
							{t("productPage.noReviewsDescription")}
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			)}
		</div>
	);
}
