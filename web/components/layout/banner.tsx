"use client";

import Link from "next/link";

import { useI18n } from "@/components/layout/i18n-provider";

export default function Banner() {
	const { t } = useI18n();

	return (
		<div className="h-8 md:h-9 text-xs md:text-sm flex justify-center items-center gap-x-1 text-center text-white bg-primary leading-none">
			{t("layout.banner")}
			<Link className="underline font-medium" href="/signup">
				{t("layout.signup")}
			</Link>
		</div>
	);
}
