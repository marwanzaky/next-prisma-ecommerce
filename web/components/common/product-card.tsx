"use client";

import Image from "next/image";
import Link from "next/link";

import { ProductEntity } from "@repo/types";

import { useI18n } from "@/components/layout/i18n-provider";
import { ButtonIcon } from "@/components/ui/button-icon";
import Stars from "@/components/ui/stars";

import { useIsMobile } from "@/shadcn/hooks/use-mobile";

import { localizePath } from "@/lib/i18n";
import { createProductSlug, formatPrice } from "@/lib/string-utils";
import { cn } from "@/lib/utils";

import { useCart } from "@/hooks/use-cart";
import { useToggleFavorite } from "@/hooks/use-toggle-favorite";

type ProductCardProps = {
	data: ProductEntity;
};

export default function ProductCard({ data }: ProductCardProps) {
	const { locale, t } = useI18n();

	const isMobile = useIsMobile({});
	const { isFavorite, addToFavorites, removeFromFavorites } =
		useToggleFavorite(data);
	const { addToCart } = useCart();

	return (
		<div
			className={cn(
				"relative flex flex-col overflow-hidden",
				"border-2 rounded-lg hover:shadow-lg transition-shadow",
			)}
		>
			<div className="absolute top-1 inset-e-1">
				{isFavorite ? (
					<ButtonIcon
						className="scale-[.85] hover:scale-100 shadow-md transition-transform"
						styleClass="filter-(--filter-primary)"
						icon="favorite_fill"
						aria-label={t("productPage.actions.removeFromFavorites")}
						onClick={removeFromFavorites}
					/>
				) : (
					<ButtonIcon
						className="scale-[.85] hover:scale-100 shadow-md transition-transform"
						icon="favorite"
						aria-label={t("productPage.actions.addToFavorites")}
						onClick={addToFavorites}
					/>
				)}
			</div>

			<Link
				href={localizePath(
					`/products/${createProductSlug(data.name.en, data._id)}`,
					locale,
				)}
			>
				<Image
					className="aspect-square object-cover w-full h-full"
					src={data.imgUrls[0]}
					alt={data.name[locale]}
					width={512}
					height={512}
					loading="lazy"
				/>
			</Link>

			<div className="relative p-2 md:p-4">
				<h3 className="truncate leading-none! mb-1 text-base md:text-lg">
					{data.name[locale]}
				</h3>

				<Stars
					className="mb-2"
					size={isMobile ? 16 : 18}
					value={data.avgRatings}
					total={data.numReviews}
				/>

				<div className="flex items-center gap-x-2">
					<div className="leading-none! text-base md:text-2xl">
						{formatPrice(data.price / 100, locale)}
					</div>
					{data.priceCompare > data.price && (
						<div className="text-gray-500 line-through leading-none! text-sm md:text-lg">
							{formatPrice(data.priceCompare / 100, locale)}
						</div>
					)}
				</div>

				<ButtonIcon
					className="absolute bottom-1 inset-e-1 sm:bottom-4 sm:inset-e-4"
					icon="shopping_cart"
					aria-label={t("productPage.actions.addToCart")}
					variant="primary"
					onClick={() => {
						addToCart(data);
					}}
				/>
			</div>
		</div>
	);
}
