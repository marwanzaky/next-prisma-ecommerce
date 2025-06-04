"use client";

import { useFavorites } from "@hooks/useFavorites";

import ProductItem from "_shared/ui/productCart";
import { TypographyH4 } from "_shared/shadcn/typography";
import { Section } from "_shared/components/section";

export default function Page() {
	const { items } = useFavorites();

	return (
		<Section className="space-y-2 lg:space-y-4">
			<TypographyH4 className="text-center">Your Favorites</TypographyH4>

			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-4">
				{items.map((item) => (
					<ProductItem data={item} key={item._id}></ProductItem>
				))}
			</div>
		</Section>
	);
}
