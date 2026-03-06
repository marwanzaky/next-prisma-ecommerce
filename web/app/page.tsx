import Header from "@components/header";
import WhyChooseUs from "@components/whyChooseUs";
import Testimonials from "@components/testimonials";

import { productsService } from "@redux/services/productsService";

import ProductCart from "_shared/ui/productCart";
import { TypographyH3 } from "_shared/shadcn/typography";
import { IProduct } from "_shared/interfaces";
import { Section } from "_shared/components/section";
import {
	categoriesService,
	ICategoryTree,
} from "@redux/services/categoriesService";
import Categories from "@components/categories";

export default async function Page() {
	const data = await getFeaturedCategories();
	const categoryTree = await getCategoryTree();

	return (
		<>
			<Header />

			<Section className="space-y-2 lg:space-y-4">
				<TypographyH3 className="text-center lg:text-left">
					Featured products
				</TypographyH3>

				<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
					{data.map((item) => (
						<ProductCart key={item._id} data={item} />
					))}
				</div>
			</Section>

			<WhyChooseUs />
			<Testimonials />
			<Categories categoryTree={categoryTree} />
		</>
	);
}

async function getFeaturedCategories(): Promise<IProduct[]> {
	return await productsService.getAllProducts({
		query: {
			featured: true,
			limit: 4,
		},
	});
}

async function getCategoryTree(): Promise<ICategoryTree[]> {
	return await categoriesService.getCategoryTree();
}
