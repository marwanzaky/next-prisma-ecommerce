"use client";

import { useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";

import { authService } from "@/services/auth-service";

import { Container } from "@/components/common/container";

export default function Page() {
	const searchParams = useSearchParams();

	const [loading, setLoading] = useState(true);
	const [emailVerified, setEmailVerified] = useState<boolean | undefined>(
		undefined,
	);

	useEffect(() => {
		setLoading(false);
		const token = searchParams.get("token");

		if (token) {
			authService.verify(token).then((res) => {
				setLoading(false);
				setEmailVerified(res.verified);
			});
		}
	}, [searchParams]);

	return (
		<Container>
			{loading ? (
				<p>Logging you in...</p>
			) : (
				<>You&apos;re email is {emailVerified ? "verified" : "not verified"}</>
			)}
		</Container>
	);
}
