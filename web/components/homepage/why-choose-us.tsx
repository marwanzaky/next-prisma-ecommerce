"use client";

import { useI18n } from "@/components/layout/i18n-provider";

import { Heading } from "@/shadcn/components/ui/typography";
import { TypographyMuted } from "@/shadcn/components/ui/typography";

import Icon from "@/shared/components/ui/icon";
import { Section } from "@/shared/components/ui/section";

import { cn } from "@/lib/utils";

export default function WhyChooseUs() {
	const { t } = useI18n();

	return (
		<Section className="lg:pt-0! space-y-2 lg:space-y-4">
			<Heading as="h2" variant="h3" className="text-center">
				{t("home.whyChooseUs")}
			</Heading>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				<Reason
					icon="local_shipping"
					title={t("home.reasons.shipping.title")}
					description={t("home.reasons.shipping.description")}
				/>
				<Reason
					icon="payments"
					title={t("home.reasons.payments.title")}
					description={t("home.reasons.payments.description")}
				/>
				<Reason
					icon="attach_money"
					title={t("home.reasons.refund.title")}
					description={t("home.reasons.refund.description")}
				/>
				<Reason
					icon="inventory_2"
					title={t("home.reasons.quality.title")}
					description={t("home.reasons.quality.description")}
				/>
			</div>
		</Section>
	);
}

function Reason({
	title,
	description,
	icon,
}: {
	title: string;
	description: string;
	icon: string;
}) {
	return (
		<div className="group">
			<div
				className={cn(
					"mx-auto lg:mx-0 mb-6 flex justify-center items-center",
					"w-17.5 h-17.5",
					"bg-secondary rounded-xl",
					"group-hover:bg-primary/20 transition-colors",
				)}
			>
				<Icon
					className="group-hover:filter-(--filter-primary) transition-all"
					src={`icons/${icon}.svg`}
					size={32}
				/>
			</div>

			<Heading
				as="h3"
				variant="h4"
				className="text-center lg:text-start truncate mb-6"
			>
				{title}
			</Heading>
			<TypographyMuted className="text-center lg:text-start text-sm md:text-base">
				{description}
			</TypographyMuted>
		</div>
	);
}
