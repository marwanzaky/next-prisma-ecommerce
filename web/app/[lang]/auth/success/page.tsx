"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { useRouter, useSearchParams } from "next/navigation";

import { useI18n } from "@/components/layout/i18n-provider";

import { handleGoogleAuth } from "@/utils/auth-helpers";

export default function Page() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const { locale } = useI18n();
	const dispatch = useDispatch();

	useEffect(() => {
		const token = searchParams.get("token");

		if (token) {
			handleGoogleAuth({ token, dispatch, router, locale });
		}
	}, [searchParams, router, dispatch, locale]);

	return <p>Logging you in...</p>;
}
