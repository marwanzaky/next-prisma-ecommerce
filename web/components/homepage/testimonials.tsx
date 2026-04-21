"use client";

import { useI18n } from "@/components/layout/i18n-provider";

import { useIsMobile } from "@/shadcn/hooks/use-mobile";

import { Container } from "@/shared/components/ui/container";
import Icon from "@/shared/components/ui/icon";
import { Section } from "@/shared/components/ui/section";

export default function Testimonials() {
	const isMobile = useIsMobile({ mobileBreakpoint: 1024 });
	const { t } = useI18n();

	return (
		<Section className="full-bleed bg-[#dfe6e9]">
			<Container>
				<div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
					<Testimonial
						blockquote={t("home.testimonials.one")}
						cite="Nihat Y."
					/>

					<Testimonial
						blockquote={t("home.testimonials.two")}
						cite="Kevin L."
					/>

					<Testimonial
						blockquote={t("home.testimonials.three")}
						cite="Dimitrios G."
					/>

					{isMobile && (
						<Testimonial
							blockquote={t("home.testimonials.four")}
							cite="Sarah M."
						/>
					)}
				</div>
			</Container>
		</Section>
	);
}

function Testimonial({
	blockquote,
	cite,
}: {
	blockquote: string;
	cite: string;
}) {
	return (
		<div>
			<div className="m-auto lg:m-0 mb-1 w-8">
				<Icon src="icons/format_quote.svg" size={32} />
			</div>

			<blockquote className="text-center italic lg:text-start text-sm md:text-base">
				{blockquote}
				<cite className="block mt-5 before:content-['\2014_\0020']">
					{cite}
				</cite>
			</blockquote>
		</div>
	);
}
