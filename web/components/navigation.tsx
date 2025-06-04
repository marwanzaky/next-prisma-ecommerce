"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import { useAppSelector } from "@redux/store";

import { cn } from "@lib/utils";

import { ButtonIcon } from "_shared/ui/buttonIcon";
import { ImageButton } from "_shared/ui/imageButton";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "_shared/shadcn/dropdown";

export default function Navigation() {
	const router = useRouter();

	const { isAuthenticated, user } = useAppSelector(
		(state) => state.authReducer,
	);
	const { items } = useAppSelector((state) => state.cartReducer);

	return (
		<nav className="flex justify-between py-3 md:py-5">
			<div className="flex-1 flex items-center">
				<Link
					className="font-bold text-lg hover:text-custom-primary-foreground transition-colors"
					href="/"
				>
					{process.env.NEXT_PUBLIC_NAME}
				</Link>
			</div>

			<ul className="flex-[2] hidden sm:flex items-center justify-center gap-10">
				<NavLi href="/" name="Home" />
				<NavLi href="/products" name="Shop" />
				{process.env.NEXT_PUBLIC_ABOUT === "true" && (
					<NavLi href="/about" name="About" />
				)}
				<NavLi href="/contact" name="Contact" />
			</ul>

			<div className="flex-1 flex justify-end">
				<ButtonIcon icon="storefront" onClick={() => router.push("/sell")} />
				<ButtonIcon icon="favorite" onClick={() => router.push("/favorites")} />
				<ButtonIcon
					className="relative"
					icon="shopping_cart"
					onClick={() => router.push("/cart")}
				>
					{items.length > 0 && <Badge>{items.length}</Badge>}
				</ButtonIcon>

				{isAuthenticated
					? process.env.NEXT_PUBLIC_ACCOUNT === "true" && (
							<div>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<ImageButton imgUrl={user?.photo || "/img/avatar.jpg"} />
									</DropdownMenuTrigger>

									<DropdownMenuContent side="bottom" align="end" sideOffset={4}>
										<DropdownMenuLabel>
											<div className="flex flex-col space-y-1">
												<span className="truncate font-medium text-sm leading-none">
													{user?.name}
												</span>
												<span className="text-xs font-normal leading-none text-muted-foreground">
													{user?.email}
												</span>
											</div>
										</DropdownMenuLabel>

										<DropdownMenuSeparator />

										<DropdownMenuGroup>
											<DropdownMenuItem
												onClick={() => {
													router.push("/me");
												}}
											>
												Account
											</DropdownMenuItem>
										</DropdownMenuGroup>

										<DropdownMenuSeparator />

										<DropdownMenuItem
											onClick={() => {
												window.localStorage.clear();
												location.reload();
											}}
										>
											Log out
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
					  )
					: process.env.NEXT_PUBLIC_ACCOUNT === "true" && (
							<ButtonIcon
								icon="person"
								onClick={() => router.push("/signin")}
							/>
					  )}
			</div>
		</nav>
	);
}

function NavLi({ href, name }: { href: string; name: string }) {
	const pathname = usePathname();
	let select = pathname === href;

	if (href === "/products" && pathname.includes("/product")) select = true;

	return (
		<li>
			<Link
				className={cn(
					"pb-1.5 border-b-2 border-transparent hover:border-b-custom-primary-foreground hover:text-custom-primary-foreground transition-colors leading-none",
					select && "font-bold text-custom-primary-foreground",
				)}
				href={href}
			>
				{name}
			</Link>
		</li>
	);
}

function Badge({ children }: { children: React.ReactNode }) {
	return (
		<div
			className={cn(
				"absolute inline-flex justify-center items-center",
				"top-[0.3125rem] -right-[0.3125rem] h-[0.875rem] w-[0.875rem]",
				"bg-custom-primary-foreground text-white text-xs rounded-full",
			)}
		>
			{children}
		</div>
	);
}
