"use cache";
import { Metadata } from "next";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";

import { ArrowRight, Clock, Truck } from "lucide-react";

import { Locale } from "@repo/types";

import { categoriesService } from "@/services/categories-service";
import { productsService } from "@/services/products-service";

import { Container } from "@/components/common/container";
import ProductCard from "@/components/common/product-card";
import { Section } from "@/components/common/section";
import Categories from "@/components/homepage/categories";
import Testimonials from "@/components/homepage/testimonials";
import WhyChooseUs from "@/components/homepage/why-choose-us";

import { Button } from "@/shadcn/components/ui/button";

import { getDictionary } from "@/lib/dictionaries";
import { generateLocaleAlternates } from "@/lib/generate";
import { localizePath } from "@/lib/i18n";

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

	const featuredProducts = await getFeaturedProducts();
	const categoryTree = await getCategoryTree();

	return (
		<>
			<Container>
				{/* Hero Section */}
				<section className="relative overflow-hidden py-12 md:py-16">
					<div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
						<div className="flex flex-col justify-center space-y-6">
							<div className="space-y-4">
								<h1 className="font-display text-4xl leading-tight font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:leading-[1.1]">
									{dictionary.home.hero.titlePrefix}{" "}
									<span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
										{dictionary.home.hero.titleHighlight}
									</span>
								</h1>
								<p className="max-w-175 text-lg text-muted-foreground md:text-xl">
									{dictionary.home.hero.description}
								</p>
							</div>
							<div className="flex flex-col gap-3 sm:flex-row">
								<Link href={localizePath("/products", lang)}>
									<Button className="group" size="lg">
										{dictionary.home.hero.shopNow}{" "}
										<ArrowRight className="h-4 w-4 rtl:rotate-180 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
									</Button>
								</Link>
							</div>
							<div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
								<div className="flex items-center gap-1.5">
									<Truck className="h-5 w-5 text-primary/70" />
									<span>{dictionary.home.hero.freeShipping}</span>
								</div>
								<div className="flex items-center gap-1.5">
									<Clock className="h-5 w-5 text-primary/70" />
									<span>{dictionary.home.hero.support}</span>
								</div>
							</div>
						</div>
						<div className="relative mx-auto hidden aspect-square w-full max-w-md overflow-hidden rounded-xl border shadow-lg lg:block">
							<div className="absolute inset-0 z-10 via-transparent to-transparent" />
							<Image
								alt="Shopping experience"
								className="object-cover"
								fill
								priority
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
								src="/img/hero.jpeg"
							/>
						</div>
					</div>
					<div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
				</section>

				<Categories categoryTree={categoryTree} />

				<Section className="space-y-2 lg:space-y-4">
					<div className="mb-8 flex flex-col items-center text-center">
						<h2 className="font-display text-3xl leading-tight font-bold tracking-tight md:text-4xl">
							{dictionary.home.featuredProducts}
						</h2>
						<div className="mt-2 h-1 w-12 rounded-full bg-primary" />
						<p className="mt-4 max-w-2xl text-center text-muted-foreground md:text-lg">
							{dictionary.home.featuredProductsDescription}
						</p>
					</div>

					<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
						{featuredProducts.map((item) => (
							<ProductCard key={item._id} data={item} />
						))}
					</div>

					<div className="mt-10 flex justify-center">
						<Link href={localizePath("/products", lang)}>
							<Button className="group" size="lg" variant="outline">
								{dictionary.home.viewAllProducts}
								<ArrowRight className="ml-2 h-4 w-4 rtl:rotate-180 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
							</Button>
						</Link>
					</div>
				</Section>

				<WhyChooseUs />
			</Container>

			<Testimonials />
		</>
	);
}

async function getFeaturedProducts() {
	return await productsService.getAllProducts({
		query: {
			featured: true,
			limit: 4,
		},
	});
}

async function getCategoryTree() {
	return await categoriesService.getCategoryTree();
}
