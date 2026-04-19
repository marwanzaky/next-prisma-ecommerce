"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAppSelector } from "@/redux/store";
import { useI18n } from "@/components/layout/i18n-provider";
import { localizePath } from "@/lib/i18n";

export function AuthGuard({ children }: { children: React.ReactNode }) {
	const { locale } = useI18n();
	const { isAuthenticated } = useAppSelector((state) => state.authReducer);
	const router = useRouter();

	useEffect(() => {
		if (!isAuthenticated) {
			router.push(localizePath("/signin", locale));
		}
	}, [isAuthenticated, router]);

	return <>{children}</>;
}
