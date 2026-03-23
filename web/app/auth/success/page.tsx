"use client";

import { handleGoogleAuth } from "@utils/authHelpers";
import { useToast } from "_shared/shadcn/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function Page() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const dispatch = useDispatch();
	const { toast } = useToast();

	useEffect(() => {
		const token = searchParams.get("token");

		if (token) {
			handleGoogleAuth(token, dispatch, router, toast);
		}
	}, [searchParams, router]);

	return <p>Logging you in...</p>;
}
