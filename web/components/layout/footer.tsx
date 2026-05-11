import Link from "next/link";

import { Facebook, Github, Instagram, Linkedin, Twitter } from "lucide-react";

import { Locale } from "@repo/types";

import { categoriesService } from "@/services/categories-service";

import { Button } from "@/shadcn/components/ui/button";

import config from "@/lib/config";
import { getDictionary } from "@/lib/dictionaries";
import { localizePath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import { Container } from "../common/container";

export default async function Footer({
	className,
	locale,
}: {
	className?: string;
	locale: Locale;
}) {
	const categoryTree = await getCategoryTree();
	const dictionary = await getDictionary(locale);

	return (
		<footer className={cn("border-t bg-background", className)}>
			<Container className="py-12">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-4">
					<div className="space-y-4">
						<Link className="flex items-center gap-2" href="/">
							<span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-xl font-bold tracking-tight text-transparent">
								{config.websiteName}
							</span>
						</Link>
						<p className="text-sm text-muted-foreground">
							{dictionary.footer.description}
						</p>
						<div className="flex space-x-4">
							<Button
								className="h-8 w-8 rounded-full"
								size="icon"
								variant="ghost"
							>
								<Facebook className="h-4 w-4" />
								<span className="sr-only">Facebook</span>
							</Button>
							<Button
								className="h-8 w-8 rounded-full"
								size="icon"
								variant="ghost"
							>
								<Twitter className="h-4 w-4" />
								<span className="sr-only">Twitter</span>
							</Button>
							<Button
								className="h-8 w-8 rounded-full"
								size="icon"
								variant="ghost"
							>
								<Instagram className="h-4 w-4" />
								<span className="sr-only">Instagram</span>
							</Button>
							<Button
								className="h-8 w-8 rounded-full"
								size="icon"
								variant="ghost"
							>
								<Github className="h-4 w-4" />
								<span className="sr-only">GitHub</span>
							</Button>
							<Button
								className="h-8 w-8 rounded-full"
								size="icon"
								variant="ghost"
							>
								<Linkedin className="h-4 w-4" />
								<span className="sr-only">LinkedIn</span>
							</Button>
						</div>
					</div>
					<div>
						<h3 className="mb-4 text-sm font-semibold">
							{dictionary.footer.shopTitle}
						</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									className="text-muted-foreground hover:text-foreground"
									href={localizePath("/products", locale)}
								>
									{dictionary.footer.allProducts}
								</Link>
							</li>
							{categoryTree.map((cat) => (
								<li key={`category-${cat.name[locale]}`}>
									<Link
										className="text-muted-foreground hover:text-foreground"
										href={localizePath(
											`/products?category=${cat.slug}`,
											locale,
										)}
									>
										{cat.name[locale]}
									</Link>
								</li>
							))}
						</ul>
					</div>
					<div>
						<h3 className="mb-4 text-sm font-semibold">
							{dictionary.footer.companyTitle}
						</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									className="text-muted-foreground hover:text-foreground"
									href={localizePath("/about", locale)}
								>
									{dictionary.footer.aboutUs}
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground hover:text-foreground"
									href={localizePath("/", locale)}
								>
									{dictionary.footer.careers}
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground hover:text-foreground"
									href={localizePath("/", locale)}
								>
									{dictionary.footer.blog}
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground hover:text-foreground"
									href={localizePath("/", locale)}
								>
									{dictionary.footer.press}
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground hover:text-foreground"
									href={localizePath("/contact", locale)}
								>
									{dictionary.footer.contact}
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h3 className="mb-4 text-sm font-semibold">
							{dictionary.footer.supportTitle}
						</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									className="text-muted-foreground hover:text-foreground"
									href={localizePath("/", locale)}
								>
									{dictionary.footer.helpCenter}
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground hover:text-foreground"
									href={localizePath("/shipping-policy", locale)}
								>
									{dictionary.footer.shippingAndReturns}
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground hover:text-foreground"
									href={localizePath("/refund-policy", locale)}
								>
									{dictionary.footer.warranty}
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground hover:text-foreground"
									href={localizePath("/privacy-policy", locale)}
								>
									{dictionary.footer.privacyPolicy}
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground hover:text-foreground"
									href={localizePath("/terms-of-service", locale)}
								>
									{dictionary.footer.termsOfService}
								</Link>
							</li>
						</ul>
					</div>
				</div>
				<div className="mt-12 border-t pt-8">
					<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
						<p className="text-sm text-muted-foreground">
							&copy; {new Date().getFullYear()} {config.websiteName}.{" "}
							{dictionary.footer.allRightsReserved}
						</p>
						<div className="flex items-center gap-4 text-sm text-muted-foreground">
							<Link
								className="hover:text-foreground"
								href={localizePath("/privacy-policy", locale)}
							>
								{dictionary.footer.privacy}
							</Link>
							<Link
								className="hover:text-foreground"
								href={localizePath("/terms-of-service", locale)}
							>
								{dictionary.footer.terms}
							</Link>
							<Link className="hover:text-foreground" href="/cookies">
								{dictionary.footer.cookies}
							</Link>
							<Link className="hover:text-foreground" href="/sitemap.xml">
								{dictionary.footer.sitemap}
							</Link>
						</div>
					</div>
				</div>
			</Container>
		</footer>
	);
}

async function getCategoryTree() {
	return await categoriesService.getCategoryTree();
}
