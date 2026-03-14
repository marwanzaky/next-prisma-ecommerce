import { TypographyH4 } from "_shared/shadcn/typography";
import { Container } from "_shared/ui/container";

import Link from "next/link";

export default function Footer() {
	return (
		<footer className="py-6 bg-custom-background pb-8">
			<Container className="space-y-12">
				<div>
					<TypographyH4 className="text-white">Quick links</TypographyH4>

					<ul className="flex gap-x-5 flex-wrap">
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

				<div className="text-white text-center font-bold">
					Copyright &copy; 2026 {process.env.NEXT_PUBLIC_NAME} all rights
					reserved.
				</div>
			</Container>
		</footer>
	);
}
