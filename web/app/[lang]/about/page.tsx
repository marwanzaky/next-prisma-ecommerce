"use client";

import { useRouter } from "next/navigation";

import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { useI18n } from "@/components/layout/i18n-provider";

import { Button } from "@/shadcn/components/ui/button";
import { TypographyP } from "@/shadcn/components/ui/typography";
import { Heading } from "@/shadcn/components/ui/typography";

import config from "@/lib/config";
import { localizePath } from "@/lib/i18n";

export default function Page() {
	const router = useRouter();
	const { locale, t } = useI18n();

	return (
		<Section>
			<Container>
				<Heading
					as="h1"
					variant="h2"
					className="text-center border-muted-foreground border-none"
				>
					{t("about.title").replace("{{name}}", config.websiteName)}
				</Heading>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12">
					<Paragraph title={t("about.communityTitle")}>
						{t("about.communityText").replace("{{name}}", config.websiteName)}
					</Paragraph>
					<Paragraph title={t("about.creatorsTitle")}>
						{t("about.creatorsText").replace("{{name}}", config.websiteName)}
					</Paragraph>
					<Paragraph title={t("about.peaceTitle")}>
						{t("about.peaceText")}
					</Paragraph>
				</div>

				<div>
					<Heading as="h3" variant="h4" className="text-center mb-6">
						{t("about.question")}
					</Heading>

					<div className="flex justify-center">
						<Button
							size="lg"
							onClick={() => router.push(localizePath("/contact", locale))}
						>
							{t("about.contact")}
						</Button>
					</div>
				</div>
			</Container>
		</Section>
	);
}

function Paragraph({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div>
			<Heading as="h2" variant="h4">
				{title}
			</Heading>
			<TypographyP>{children}</TypographyP>
		</div>
	);
}
