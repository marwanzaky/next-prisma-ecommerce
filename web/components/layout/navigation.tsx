"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
	BadgeCheck,
	LogOut,
	Menu,
	MessagesSquare,
	SearchIcon,
	ShoppingBag,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";

import { Locale } from "@repo/types";

import { logOut } from "@/redux/slices/auth-slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";

import { categoriesService } from "@/services/categories-service";

import { useI18n } from "@/components/layout/i18n-provider";
import { ButtonIcon } from "@/components/ui/button-icon";
import { ImageButton } from "@/components/ui/image-button";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/shadcn/components/ui/avatar";
import { Button } from "@/shadcn/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/shadcn/components/ui/dropdown-menu";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/shadcn/components/ui/input-group";
import { useIsMobile } from "@/shadcn/hooks/use-mobile";

import { localeLabels, localizePath } from "@/lib/i18n";
import { initials } from "@/lib/string-utils";
import { cn } from "@/lib/utils";

import { ProductsPageParams } from "@/types/product.type";

import { Container } from "../common/container";

export default function Navigation() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const isMobile = useIsMobile({});

	const { locale, t } = useI18n();

	const { isAuthenticated, user } = useAppSelector((state) => state.auth);
	const { items } = useAppSelector((state) => state.cart);

	const dispatch = useAppDispatch();

	const [search, setSearch] = useState<string>("");

	useEffect(() => {
		const params = Object.fromEntries(
			searchParams.entries(),
		) as ProductsPageParams;
		setSearch(params.name ? params.name : "");
	}, [searchParams]);

	return (
		<nav className="border-b-2 sticky top-0 z-50 bg-white">
			<Container className="flex items-center justify-between gap-4 h-16 md:h-20">
				<div className="flex-1 flex items-center gap-0 md:gap-4">
					<div>
						<NavigationMenu />
					</div>

					<Logo className="hidden lg:block" />

					<form
						className="max-w-32 sm:w-32"
						onSubmit={(event) => {
							event.preventDefault();
							const params = new URLSearchParams();
							params.set("name", search ? search : "");
							router.push(
								localizePath(`/products?${params.toString()}`, locale),
							);
						}}
					>
						<InputGroup>
							<InputGroupInput
								placeholder={t("navigation.searchPlaceholder")}
								value={search}
								onChange={(event) => setSearch(event.target.value)}
							/>
							<InputGroupAddon align="inline-start">
								<SearchIcon />
							</InputGroupAddon>
						</InputGroup>
					</form>
				</div>

				<ul className="flex-2 hidden sm:flex items-center justify-center gap-10">
					<NavLi
						href={localizePath("/", locale)}
						name={t("navigation.li.home")}
					/>
					<NavLi
						href={localizePath("/products", locale)}
						name={t("navigation.li.shop")}
					/>
					{!isMobile && (
						<NavLi
							href={localizePath("/about", locale)}
							name={t("navigation.li.about")}
						/>
					)}
					<NavLi
						href={localizePath("/contact", locale)}
						name={t("navigation.li.contact")}
					/>
				</ul>

				<Logo className="block sm:hidden" />

				<div className="flex-1 flex items-center justify-end">
					<ButtonIcon
						className="hidden sm:inline-flex"
						icon="storefront"
						aria-label="Go to Sell page"
						onClick={() => router.push(localizePath("/store/products", locale))}
					/>
					<ButtonIcon
						icon="favorite"
						aria-label="Go to Favorites page"
						onClick={() => router.push(localizePath("/favorites", locale))}
					/>
					<ButtonIcon
						className="relative"
						icon="shopping_cart"
						aria-label="Go to Cart page"
						onClick={() => router.push(localizePath("/cart", locale))}
					>
						{items.length > 0 && <Badge>{items.length}</Badge>}
					</ButtonIcon>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className="hidden md:inline-flex uppercase"
								aria-label={t("navigation.actions.language")}
							>
								{locale}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" sideOffset={4}>
							<DropdownMenuLabel>
								{t("navigation.actions.language")}
							</DropdownMenuLabel>
							{(Object.keys(localeLabels) as Locale[]).map((lang) => (
								<DropdownMenuItem
									key={lang}
									onClick={() => {
										const query = searchParams.toString();
										router.push(`${localizePath(pathname, lang)}?${query}`);
									}}
								>
									{localeLabels[lang]}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					{isAuthenticated && user ? (
						<div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<ImageButton
										imgUrl={user.photoUrl}
										fallback={initials(user.name)}
										alt={t("photoOf").replace("{{name}}", user.name)}
									/>
								</DropdownMenuTrigger>

								<DropdownMenuContent
									className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
									side={"bottom"}
									align="end"
									sideOffset={4}
								>
									<DropdownMenuLabel className="p-0 font-normal">
										<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
											<Avatar className="h-8 w-8">
												<AvatarImage src={user.photoUrl} alt={user.name} />
												<AvatarFallback>{initials(user.name)}</AvatarFallback>
											</Avatar>
											<div className="grid flex-1 text-start text-sm leading-tight">
												<span className="text-foreground truncate font-medium">
													{user.name}
												</span>
												<span className="truncate text-xs">{user.email}</span>
											</div>
										</div>
									</DropdownMenuLabel>

									<DropdownMenuSeparator />

									<DropdownMenuGroup>
										{isMobile && (
											<DropdownMenuItem
												onClick={() => {
													router.push(localizePath("/store/products", locale));
												}}
											>
												<ShoppingBag />
												{t("navigation.actions.store")}
											</DropdownMenuItem>
										)}
										<DropdownMenuItem
											onClick={() => {
												router.push(localizePath("/account", locale));
											}}
										>
											<BadgeCheck />
											{t("navigation.actions.account")}
										</DropdownMenuItem>
									</DropdownMenuGroup>

									<DropdownMenuSeparator />

									{user.role === "admin" && (
										<>
											<DropdownMenuLabel>
												{t("navigation.actions.admin")}
											</DropdownMenuLabel>

											<DropdownMenuGroup>
												<DropdownMenuItem
													onClick={() => {
														router.push(
															localizePath("/admin/messages", locale),
														);
													}}
												>
													<MessagesSquare />
													{t("navigation.actions.messages")}
												</DropdownMenuItem>

												<DropdownMenuItem
													onClick={() => {
														router.push(
															localizePath("/admin/categories", locale),
														);
													}}
												>
													<Menu />
													{t("navigation.actions.categories")}
												</DropdownMenuItem>
											</DropdownMenuGroup>

											<DropdownMenuSeparator />
										</>
									)}

									<DropdownMenuItem
										onClick={async () => {
											await dispatch(logOut());
											window.localStorage.clear();
											location.reload();
										}}
									>
										<LogOut />
										{t("navigation.actions.logOut")}
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					) : (
						<ButtonIcon
							icon="person"
							aria-label="Go to Sign In page"
							onClick={() => router.push(localizePath("/signin", locale))}
						/>
					)}
				</div>
			</Container>
		</nav>
	);
}

function NavigationMenu() {
	const router = useRouter();
	const { locale, t } = useI18n();

	const { data } = useQuery({
		queryKey: ["category-tree"],
		queryFn: () => categoriesService.getCategoryTree(),
		staleTime: 1000 * 60 * 5,
	});

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<ButtonIcon icon="menu" aria-label="Open categories menu" />
			</DropdownMenuTrigger>

			<DropdownMenuContent side="bottom" align="start" sideOffset={4}>
				<DropdownMenuLabel>
					{t("navigation.actions.categories")}
				</DropdownMenuLabel>

				{data?.map((cat) => (
					<DropdownMenuSub key={`menu-sub-${cat.slug}`}>
						<DropdownMenuSubTrigger>{cat.name[locale]}</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								{cat.children.map((subcat) => (
									<DropdownMenuItem
										key={`menu-item-${subcat.slug}`}
										onClick={() => {
											const params = new URLSearchParams();
											params.set("category", subcat.slug);
											router.push(
												localizePath(`/products?${params.toString()}`, locale),
											);
										}}
									>
										{subcat.name[locale]}
									</DropdownMenuItem>
								))}
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function NavLi({ href, name }: { href: string; name: string }) {
	const pathname = usePathname();
	const { locale } = useI18n();
	const select = pathname === localizePath(href, locale);

	return (
		<li>
			<Link
				className={cn(
					"pb-1.5 border-b-2 border-transparent hover:border-b-primary hover:text-custom-primary-foreground transition-colors leading-none",
					select && "font-bold text-primary",
				)}
				href={href}
			>
				{name}
			</Link>
		</li>
	);
}

function Logo({ className }: { className?: string }) {
	const { locale } = useI18n();

	return (
		<Link
			className={cn(
				"font-bold text-lg hover:text-primary transition-colors",
				className,
			)}
			href={localizePath("/", locale)}
		>
			{process.env.NEXT_PUBLIC_NAME}
		</Link>
	);
}

function Badge({ children }: { children: React.ReactNode }) {
	return (
		<div
			className={cn(
				"absolute inline-flex justify-center items-center",
				"top-1.25 -right-1.25 h-3.5 w-3.5",
				"bg-primary text-white text-xs rounded-full",
			)}
		>
			{children}
		</div>
	);
}
