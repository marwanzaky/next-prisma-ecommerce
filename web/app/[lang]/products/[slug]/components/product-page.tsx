"use client";

import { useMemo, useState } from "react";

import {
	GetAllProducts,
	ProductWithVariantsReviewsUserTranslatedText,
} from "@repo/database";
import { useQuery } from "@tanstack/react-query";

import { productsService } from "@/services/products-service";

import { Container } from "@/components/common/container";
import ProductCard from "@/components/common/product-card";
import ProductCardSkeleton from "@/components/common/product-card-skeleton";
import { Section } from "@/components/common/section";
import { useI18n } from "@/components/layout/i18n-provider";

import { Heading } from "@/shadcn/components/ui/typography";

import { cn } from "@/lib/utils";

import Feedback from "./feedback";
import ProductCallery from "./product-callery";
import ProductDetails, { selectedProductVariant } from "./product-details";

export default function ProductPage({
	product,
}: {
	product: ProductWithVariantsReviewsUserTranslatedText;
}) {
	const { t } = useI18n();
	const params: GetAllProducts = {
		excludeIds: [product.id],
		categoryId: product.categoryId,
		limit: 4,
	};

	const { data: similarProducts, isLoading } = useQuery({
		queryKey: ["similar-products", params],
		queryFn: () => productsService.getAllProducts(params),
		// staleTime: 1000 * 60 * 5,
		staleTime: 0,
	});

	const [selectedOptions, setSelectedOptions] = useState<
		Record<string, string>
	>(() => {
		const result: Record<string, string> = {};
		product.options.forEach((option) => {
			result[option.id] = option.values[0].id;
		});
		return result;
	});

	const selectedVariant = useMemo(
		() => selectedProductVariant(product, selectedOptions)!,
		[product, selectedOptions],
	);

	return (
		<Container>
			<Section className="space-y-4 md:space-y-4">
				<div
					className={cn(
						"md:relative",
						"grid grid-cols-1 md:grid-cols-2",
						"gap-x-10 gap-y-5",
					)}
				>
					<ProductCallery product={product} selectedVariant={selectedVariant} />
					<ProductDetails
						product={product}
						selectedVariant={selectedVariant}
						selectedOptions={selectedOptions}
						setSelectedOptions={setSelectedOptions}
					/>
				</div>

				<Feedback product={product} />
			</Section>

			<Section className="pt-0! space-y-2 lg:space-y-4">
				<Heading as="h2" variant="h3" className="text-center">
					{t("productPage.similarProducts")}
				</Heading>

				<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
					{!isLoading ? (
						similarProducts?.map((item) => (
							<ProductCard key={item.id} data={item} />
						))
					) : (
						<>
							<ProductCardSkeleton />
							<ProductCardSkeleton />
							<ProductCardSkeleton />
							<ProductCardSkeleton />
						</>
					)}
				</div>
			</Section>
		</Container>
	);
}
