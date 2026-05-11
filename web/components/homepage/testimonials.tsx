"use client";

import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { useI18n } from "@/components/layout/i18n-provider";
import Icon from "@/components/ui/icon";

import { useIsMobile } from "@/shadcn/hooks/use-mobile";

export default function Testimonials() {
	const isMobile = useIsMobile({ mobileBreakpoint: 1024 });
	const { t } = useI18n();

	return (
		<Section className="bg-foreground/5">
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
