"use client";

import Link from "next/link";
import Image from "next/image";

import { useDispatch } from "react-redux";
import { postCartItemAsync } from "@redux/thunks/cartThunks";
import { AppDispatch } from "@redux/store";

import { useToggleFavorite } from "@hooks/useToggleFavorite";

import { cn } from "@lib/utils";

import Stars from "_shared/components/stars";
import { IProduct } from "_shared/interfaces";
import { ButtonIcon } from "_shared/ui/buttonIcon";
import { useToast } from "_shared/shadcn/hooks/use-toast";
import { formatPrice } from "@utils/formatPrice";
import { useIsMobile } from "_shared/shadcn/hooks/use-mobile";

type ProductCartProps = {
	data: IProduct;
};

export default function ProductCart({ data }: ProductCartProps) {
	const dispatch = useDispatch<AppDispatch>();

	const { toast } = useToast();
	const { isFavorite, addToFavorites, removeFromFavorites } =
		useToggleFavorite(data);

	return (
		<div
			className={cn(
				"relative flex flex-col overflow-hidden",
				"border-2 rounded-lg hover:shadow-lg transition-shadow",
			)}
		>
			<div className="absolute top-1 right-1">
				{isFavorite ? (
					<ButtonIcon
						className="scale-[.85] hover:scale-100 shadow-md transition-transform"
						styleClass="filter-custom-primary-foreground"
						icon="favorite_fill"
						onClick={removeFromFavorites}
					/>
				) : (
					<ButtonIcon
						className="scale-[.85] hover:scale-100 shadow-md transition-transform"
						icon="favorite"
						onClick={addToFavorites}
					/>
				)}
			</div>

			<Link href={`/product/${data._id}`}>
				<Image
					className="aspect-square object-cover w-full h-full"
					src={data.imgUrls[0]}
					alt={data.name}
					width={512}
					height={512}
				/>
			</Link>

			<div className="relative p-2 md:p-4">
				<h3 className="truncate !leading-none mb-1 text-base md:text-lg">
					{data.name}
				</h3>

				{process.env.NEXT_PUBLIC_REVIEWS === "true" && (
					<Stars
						className="mb-2"
						size={useIsMobile() ? 15 : 18}
						value={data.avgRatings}
						total={data.numReviews}
					/>
				)}

				<div className="flex items-center gap-x-2">
					<div className="!leading-none text-base md:text-2xl">
						{formatPrice(data.price)}
					</div>
					{data.priceCompare > data.price && (
						<div className="text-gray-500 line-through !leading-none text-sm md:text-lg">
							{formatPrice(data.priceCompare)}
						</div>
					)}
				</div>

				<ButtonIcon
					className="absolute bottom-1 right-1 sm:bottom-4 sm:right-4"
					icon="shopping_cart"
					onClick={() => dispatch(postCartItemAsync({ product: data, toast }))}
				/>
			</div>
		</div>
	);
}
