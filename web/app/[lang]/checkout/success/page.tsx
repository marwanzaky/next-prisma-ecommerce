"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { CheckCircle } from "lucide-react";

import { Button } from "@/shadcn/components/ui/button";
import { TypographyMuted } from "@/shadcn/components/ui/typography";
import { localizePath } from "@/lib/i18n";
import { useI18n } from "@/components/layout/i18n-provider";

export default function SuccessPage() {
	const { locale } = useI18n();

	const searchParams = useSearchParams();
	const sessionId = searchParams.get("session_id");
	const orderId = searchParams.get("order_id");

	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center prose mx-auto">
			<CheckCircle className="h-16 w-16 text-green-500 mb-4 animate-bounce" />

			<h1>Thank you for your purchase!</h1>

			<p className="max-w-md">
				Your payment was processed securely. We've sent a confirmation email
				with your order summary.
			</p>

			{sessionId && (
				<TypographyMuted>
					Receipt ID: {sessionId.substring(0, 20)}...
				</TypographyMuted>
			)}

			<div className="mt-8 flex gap-4">
				<Link href={localizePath(`/orders/${orderId}`, locale)}>
					<Button variant="outline">View my order</Button>
				</Link>
				<Link href={localizePath("/", locale)}>
					<Button>Continue shopping</Button>
				</Link>
			</div>
		</div>
	);
}
