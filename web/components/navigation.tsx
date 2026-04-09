"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { AppDispatch, useAppSelector } from "@redux/store";

import { cn } from "@lib/utils";

import { ButtonIcon } from "@shared/components/ui/button-icon";
import { ImageButton } from "@shared/components/ui/image-button";
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
} from "@shadcn/components/ui/dropdown-menu";
import { useIsMobile } from "@shadcn/hooks/use-mobile";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { categoriesService } from "@redux/services/categories-service";
import { ProductsPageParams } from "@hooks/use-products";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@shadcn/components/ui/avatar";
import { initials } from "@utils/string-utils";
import {
	BadgeCheck,
	LogOut,
	Menu,
	MessagesSquare,
	SearchIcon,
	ShoppingBag,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logOut } from "@redux/slices/auth-slice";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@shadcn/components/ui/input-group";

export default function Navigation() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const isMobile = useIsMobile({});

	const { isAuthenticated, user } = useAppSelector(
		(state) => state.authReducer,
	);
	const { items } = useAppSelector((state) => state.cartReducer);
	const dispatch = useDispatch<AppDispatch>();

	const [search, setSearch] = useState<string>("");

	useEffect(() => {
		const params = Object.fromEntries(
			searchParams.entries(),
		) as ProductsPageParams;
		setSearch(params.name ? params.name : "");
	}, [searchParams]);

	return (
		<nav className="flex items-center justify-between gap-4 h-16 md:h-20">
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
						router.push(`/products?${params.toString()}`);
					}}
				>
					<InputGroup>
						<InputGroupInput
							placeholder="Search..."
							value={search}
							onChange={(event) => setSearch(event.target.value)}
						/>
						<InputGroupAddon align="inline-start">
							<SearchIcon className="text-muted-foreground" />
						</InputGroupAddon>
					</InputGroup>
				</form>
			</div>

			<ul className="flex-2 hidden sm:flex items-center justify-center gap-10">
				<NavLi href="/" name="Home" />
				<NavLi href="/products" name="Shop" />
				{process.env.NEXT_PUBLIC_ABOUT === "true" && !isMobile && (
					<NavLi href="/about" name="About" />
				)}
				<NavLi href="/contact" name="Contact" />
			</ul>

			<Logo className="block sm:hidden" />

			<div className="flex-1 flex items-center justify-end">
				<ButtonIcon
					className="hidden sm:inline-flex"
					icon="storefront"
					aria-label="Go to Sell page"
					onClick={() => router.push("/store/products")}
				/>
				<ButtonIcon
					icon="favorite"
					aria-label="Go to Favorites page"
					onClick={() => router.push("/favorites")}
				/>
				<ButtonIcon
					className="relative"
					icon="shopping_cart"
					aria-label="Go to Cart page"
					onClick={() => router.push("/cart")}
				>
					{items.length > 0 && <Badge>{items.length}</Badge>}
				</ButtonIcon>

				{isAuthenticated && user
					? process.env.NEXT_PUBLIC_ACCOUNT === "true" && (
							<div>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<ImageButton
											imgUrl={user.photoUrl}
											fallback={initials(user.name)}
											alt={`Photo of ${user.name}`}
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
												<div className="grid flex-1 text-left text-sm leading-tight">
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
														router.push("/store/products");
													}}
												>
													<ShoppingBag />
													Store
												</DropdownMenuItem>
											)}
											<DropdownMenuItem
												onClick={() => {
													router.push("/account");
												}}
											>
												<BadgeCheck />
												Account
											</DropdownMenuItem>
										</DropdownMenuGroup>

										<DropdownMenuSeparator />

										{user.role === "admin" && (
											<>
												<DropdownMenuLabel>Admin</DropdownMenuLabel>

												<DropdownMenuGroup>
													<DropdownMenuItem
														onClick={() => {
															router.push("/admin/messages");
														}}
													>
														<MessagesSquare />
														Messages
													</DropdownMenuItem>

													<DropdownMenuItem
														onClick={() => {
															router.push("/admin/categories");
														}}
													>
														<Menu />
														Categories
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
											Log out
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						)
					: process.env.NEXT_PUBLIC_ACCOUNT === "true" && (
							<ButtonIcon
								icon="person"
								aria-label="Go to Sign In page"
								onClick={() => router.push("/signin")}
							/>
						)}
			</div>
		</nav>
	);
}

function NavigationMenu() {
	const router = useRouter();

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
				<DropdownMenuLabel>Categories</DropdownMenuLabel>

				{data?.map((cat) => (
					<DropdownMenuSub key={`menu-sub-${cat.slug}`}>
						<DropdownMenuSubTrigger>{cat.name}</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								{cat.children.map((subcat) => (
									<DropdownMenuItem
										key={`menu-item-${subcat.slug}`}
										onClick={() => {
											const params = new URLSearchParams();
											params.set("category", subcat.slug);
											router.push(`/products?${params.toString()}`);
										}}
									>
										{subcat.name}
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
	let select = pathname === href;

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
	return (
		<Link
			className={cn(
				"font-bold text-lg hover:text-primary transition-colors",
				className,
			)}
			href="/"
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
