"use client";

import { useAppSelector } from "@redux/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
	const { isAuthenticated } = useAppSelector((state) => state.authReducer);
	const router = useRouter();

	useEffect(() => {
		if (!isAuthenticated) {
			router.push("/signin");
		}
	}, [isAuthenticated, router]);

	return <>{children}</>;
}
