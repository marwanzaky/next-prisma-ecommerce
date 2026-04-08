"use client";
import { useRouter } from "next/navigation";

import ProductCard from "@shared/components/ui/product-card";

import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@shadcn/components/ui/empty";
import { Heading } from "@shadcn/components/ui/typography";
import { Section } from "@shared/components/ui/section";
import { Button } from "@shadcn/components/ui/button";
import { useAppSelector } from "@redux/store";

export default function Page() {
	const router = useRouter();
	const { items } = useAppSelector((state) => state.favoritesReducer);

	return (
		<Section className="space-y-2 lg:space-y-4">
			<Heading as="h4" className="text-center">
				Your Favorites
			</Heading>
			{items.length > 0 ? (
				<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
					{items.map((item) => (
						<ProductCard data={item} key={item._id} />
					))}
				</div>
			) : (
				<Empty className="border border-dashed">
					<EmptyHeader>
						<EmptyTitle>Nothing here... yet.</EmptyTitle>
						<EmptyDescription className="max-w-xs text-pretty">
							Start favoriting items to compare, shop, and keep track of things
							you love.
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<Button variant="outline" onClick={() => router.push("/products")}>
							Continue shopping
						</Button>
					</EmptyContent>
				</Empty>
			)}
		</Section>
	);
}
