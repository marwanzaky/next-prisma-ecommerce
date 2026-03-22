"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { TypographyH1 } from "_shared/components/typography";
import { TypographyP } from "_shared/shadcn/typography";
import { Button } from "_shared/shadcn/button";
import { createProductSlug } from "@utils/stringUtils";

export default function Header() {
	const router = useRouter();
	const productId = process.env.NEXT_PUBLIC_HEADER_PRODUCT_ID!;
	const productName = process.env.NEXT_PUBLIC_HEADER_PRODUCT_NAME!;
	const productDescription =
		process.env.NEXT_PUBLIC_HEADER_PRODUCT_DESCRIPTION!;

	return (
		<header className="full-bleed relative px-4 py-16 md:py-16">
			<Image
				fill
				priority
				className="object-center object-cover pointer-events-none z-[-1]"
				src="/img/background.jpg"
				alt="background"
			/>

			<div className="space-y-4">
				<div>
					<TypographyH1 className="text-center text-white">
						{productName}
					</TypographyH1>
					<TypographyP className="text-center text-white max-w-xs mx-auto">
						{productDescription}
					</TypographyP>
				</div>

				<div className="flex justify-center gap-2">
					<Button
						onClick={() =>
							router.push(
								`/product/${createProductSlug(productName, productId)}`,
							)
						}
					>
						Shop now
					</Button>
					<Button
						variant="ghost"
						className="text-white"
						onClick={() => router.push("/products")}
					>
						Explore
					</Button>
				</div>
			</div>
		</header>
	);
}
