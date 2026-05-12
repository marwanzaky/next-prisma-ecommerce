"use client";

import Image from "next/image";
import Link from "next/link";

import { PublicCategoryTree } from "@repo/types";

import { useI18n } from "@/components/layout/i18n-provider";

import { localizePath } from "@/lib/i18n";

export default function Categories({
	categoryTree,
}: {
	categoryTree: PublicCategoryTree[];
}) {
	const { locale, t } = useI18n();

	return (
		<section className="py-12 md:py-16">
			<div className="mb-8 flex flex-col items-center text-center">
				<h2 className="font-display text-3xl leading-tight font-bold tracking-tight md:text-4xl">
					{t("home.categories.title")}
				</h2>
				<div className="mt-2 h-1 w-12 rounded-full bg-primary" />
				<p className="mt-4 max-w-2xl text-center text-muted-foreground">
					{t("home.categories.description")}
				</p>
			</div>

			<div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
				{categoryTree.map((category) => (
					<Link
						aria-label={`Browse ${category.name} products`}
						className="group relative flex flex-col space-y-4 overflow-hidden rounded-2xl border bg-card shadow transition-all duration-300 hover:shadow-lg"
						href={localizePath(`/products?category=${category.slug}`, locale)}
						key={category.name[locale]}
					>
						<div className="relative aspect-4/3 overflow-hidden">
							<div className="absolute inset-0 z-10 bg-linear-to-t from-background/80 to-transparent" />
							<Image
								alt={category.name[locale]}
								className="object-cover transition duration-300 group-hover:scale-105"
								fill
								sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
								src={category.imgUrl || ""}
							/>
						</div>
						<div className="relative z-20 -mt-6 p-4">
							<div className="mb-1 text-lg font-medium">
								{category.name[locale]}
							</div>
							<p className="text-sm text-muted-foreground">
								{(category.productCount === 1
									? t("product")
									: t("products")
								).replace("{{count}}", String(category.productCount))}
							</p>
						</div>
					</Link>
				))}
			</div>
		</section>
	);
}
