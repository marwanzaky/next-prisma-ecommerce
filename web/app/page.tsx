import Header from "@components/header";
import WhyChooseUs from "@components/whyChooseUs";
import Testimonials from "@components/testimonials";

import { IProduct } from "_shared/interfaces";
import { productsService } from "@redux/services/productsService";
import { TypographyH3 } from "_shared/shadcn/typography";
import ProductCart from "_shared/ui/productCart";
import { Section } from "_shared/components/section";

export default async function Page() {
	const data = await getProducts();

	return (
		<>
			<Header />

			<Section className="space-y-2 lg:space-y-4">
				<TypographyH3 className="text-center lg:text-left">
					Featured collection
				</TypographyH3>

				<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
					{data.map((item) => (
						<ProductCart key={item._id} data={item} />
					))}
				</div>
			</Section>

			<WhyChooseUs />
			<Testimonials />
		</>
	);
}

async function getProducts(): Promise<IProduct[]> {
	return await productsService.getAllProducts({
		query: {
			featured: true,
			limit: 4,
		},
	});
}
