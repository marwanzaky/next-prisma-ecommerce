"use cache";
import { Metadata } from "next";
import { cacheLife } from "next/cache";

import { categoriesService } from "@/services/categories-service";
import { productsService } from "@/services/products-service";

import { Container } from "@/components/common/container";
import ProductCard from "@/components/common/product-card";
import { Section } from "@/components/common/section";
import Categories from "@/components/homepage/categories";
import Header from "@/components/homepage/header";
import Testimonials from "@/components/homepage/testimonials";
import WhyChooseUs from "@/components/homepage/why-choose-us";

import { Heading } from "@/shadcn/components/ui/typography";

import { getDictionary } from "@/lib/dictionaries";
import { generateLocaleAlternates } from "@/lib/generate";
import { Locale } from "@/lib/i18n";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
	const { lang } = await params;

	return {
		alternates: generateLocaleAlternates("/", lang),
	};
}

export default async function Page({
	params,
}: {
	params: Promise<{ lang: Locale }>;
}) {
	cacheLife("minutes");

	const { lang } = await params;
	const dictionary = await getDictionary(lang);

	const heroProduct = await getHeroProduct();
	const featuredCategories = await getFeaturedCategories();
	const categoryTree = await getCategoryTree();

	return (
		<>
			<Container>
				<Header heroProduct={heroProduct[0]} />

				<Section className="space-y-2 lg:space-y-4">
					<Heading as="h2" variant="h3" className="text-center">
						{dictionary.home.featuredProducts}
					</Heading>

					<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
						{featuredCategories.map((item) => (
							<ProductCard key={item._id} data={item} />
						))}
					</div>
				</Section>

				<WhyChooseUs />
			</Container>

			<Testimonials />

			<Categories categoryTree={categoryTree} />
		</>
	);
}

async function getFeaturedCategories() {
	return await productsService.getAllProducts({
		query: {
			featured: true,
			limit: 4,
		},
	});
}

async function getHeroProduct() {
	return await productsService.getAllProducts({
		query: {
			isHero: true,
			limit: 1,
		},
	});
}

async function getCategoryTree() {
	return await categoriesService.getCategoryTree();
}
