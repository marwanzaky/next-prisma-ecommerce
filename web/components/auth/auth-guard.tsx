"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useAppSelector } from "@/redux/store";

import { useI18n } from "@/components/layout/i18n-provider";

import { localizePath } from "@/lib/i18n";

export function AuthGuard({ children }: { children: React.ReactNode }) {
	const router = useRouter();

	const { locale } = useI18n();
	const { isAuthenticated } = useAppSelector((state) => state.auth);

	useEffect(() => {
		if (!isAuthenticated) {
			router.push(localizePath("/signin", locale));
		}
	}, [isAuthenticated, router, locale]);

	return <>{children}</>;
}
