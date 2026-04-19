"use cache";
import { cacheLife } from "next/cache";
import { Metadata } from "next";

import Header from "@/components/homepage/header";
import WhyChooseUs from "@/components/homepage/why-choose-us";
import Testimonials from "@/components/homepage/testimonials";
import Categories from "@/components/homepage/categories";

import { Heading } from "@/shadcn/components/ui/typography";

import { IProduct } from "@/types/product.type";

import { Section } from "@/shared/components/ui/section";
import ProductCard from "@/shared/components/ui/product-card";

import { productsService } from "@/redux/services/products-service";
import { categoriesService } from "@/redux/services/categories-service";

import { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { generateLocaleAlternates } from "@/lib/generate";

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

async function getHeroProduct(): Promise<IProduct[]> {
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
