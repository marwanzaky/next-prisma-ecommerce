import Link from "next/link";
import Image from "next/image";

import { Container } from "@shared/components/ui/container";
import { Heading } from "@shadcn/components/ui/typography";
import { Separator } from "@shadcn/components/ui/separator";

export default function Footer() {
	return (
		<footer className="py-6 bg-custom-background pb-8">
			<Container className="space-y-6!">
				<div className="space-y-4">
					<Heading as="h3" variant="h4" className="text-white">
						Quick links
					</Heading>

					<ul className="flex flex-col md:flex-row gap-5 flex-wrap text-sm">
						{process.env.NEXT_PUBLIC_ABOUT === "true" && (
							<li>
								<Link
									className="text-white whitespace-nowrap hover:underline"
									href="/about"
								>
									About Us
								</Link>
							</li>
						)}
						<li>
							<Link
								className="text-white whitespace-nowrap hover:underline"
								href="/refund-policy"
							>
								Refund Policy
							</Link>
						</li>

						<li>
							<Link
								className="text-white whitespace-nowrap hover:underline"
								href="/privacy-policy"
							>
								Privacy Policy
							</Link>
						</li>

						<li>
							<Link
								className="text-white whitespace-nowrap hover:underline"
								href="/terms-of-service"
							>
								Terms of Service
							</Link>
						</li>

						<li>
							<Link
								className="text-white whitespace-nowrap hover:underline"
								href="/shipping-policy"
							>
								Shipping Policy
							</Link>
						</li>
					</ul>
				</div>

				<div className="full-bleed">
					<Separator className="bg-[#525f63]" />
				</div>

				<div className="space-y-4">
					<div className="flex justify-center gap-2 h-6">
						<Image
							src="/svgs/payments/visa.svg"
							alt="Visa"
							width={36}
							height={24}
							loading="lazy"
						/>
						<Image
							src="/svgs/payments/mastercard.svg"
							alt="Mastercard"
							width={36}
							height={24}
							loading="lazy"
						/>
						<Image
							src="/svgs/payments/american_express.svg"
							alt="American Express"
							width={36}
							height={24}
							loading="lazy"
						/>
						<Image
							src="/svgs/payments/discover.svg"
							alt="Discover"
							width={36}
							height={24}
							loading="lazy"
						/>
					</div>

					<div className="text-sm text-white text-center font-bold">
						Copyright &copy; 2026 {process.env.NEXT_PUBLIC_NAME} all rights
						reserved.
					</div>
				</div>
			</Container>
		</footer>
	);
}
