"use client";

import { useEffect } from "react";

import { useSearchParams } from "next/navigation";

import { useAuth } from "@/hooks/use-auth";

export default function Page() {
	const searchParams = useSearchParams();

	const { googleAuth } = useAuth();

	useEffect(() => {
		const token = searchParams.get("token");

		if (token) {
			googleAuth(token);
		}
	}, [searchParams]);

	return <p>Logging you in...</p>;
}
