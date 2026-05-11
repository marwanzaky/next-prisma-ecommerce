"use client";

import React from "react";

import { Clock, ShoppingBag, Star, Truck } from "lucide-react";

import { useI18n } from "@/components/layout/i18n-provider";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shadcn/components/ui/card";

import { DictionaryKeys } from "@/types/i18n.type";

const featuresWhyChooseUs: {
	icon: React.ReactNode;
	titleKey: DictionaryKeys;
	descriptionKey: DictionaryKeys;
}[] = [
	{
		icon: <Truck className="h-6 w-6 text-primary" />,
		titleKey: "home.whyChooseUs.cards.freeShipping.title",
		descriptionKey: "home.whyChooseUs.cards.freeShipping.description",
	},
	{
		icon: <ShoppingBag className="h-6 w-6 text-primary" />,
		titleKey: "home.whyChooseUs.cards.secureCheckout.title",
		descriptionKey: "home.whyChooseUs.cards.secureCheckout.description",
	},
	{
		icon: <Clock className="h-6 w-6 text-primary" />,
		titleKey: "home.whyChooseUs.cards.support.title",
		descriptionKey: "home.whyChooseUs.cards.support.description",
	},
	{
		icon: <Star className="h-6 w-6 text-primary" />,
		titleKey: "home.whyChooseUs.cards.qualityGuarantee.title",
		descriptionKey: "home.whyChooseUs.cards.qualityGuarantee.description",
	},
];

export default function WhyChooseUs() {
	const { t } = useI18n();

	return (
		<section className="py-12 md:py-16" id="features">
			<div className="mb-8 flex flex-col items-center text-center">
				<h2 className="font-display text-3xl leading-tight font-bold tracking-tight md:text-4xl">
					{t("home.whyChooseUs.title")}
				</h2>
				<div className="mt-2 h-1 w-12 rounded-full bg-primary" />
				<p className="mt-4 max-w-2xl text-center text-muted-foreground md:text-lg">
					{t("home.whyChooseUs.description")}
				</p>
			</div>

			<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
				{featuresWhyChooseUs.map((feature) => (
					<Card
						className="rounded-2xl border-none bg-background shadow transition-all duration-300 hover:shadow-lg"
						key={feature.titleKey}
					>
						<CardHeader className="pb-2">
							<div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
								{feature.icon}
							</div>
							<CardTitle>{t(feature.titleKey)}</CardTitle>
						</CardHeader>
						<CardContent>
							<CardDescription className="text-base">
								{t(feature.descriptionKey)}
							</CardDescription>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}
