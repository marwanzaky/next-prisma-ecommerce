import Link from "next/link";

import { Avatar, AvatarImage } from "@/shadcn/components/ui/avatar";

import { PublicCategoryTree } from "@/shared/types/category.type";

export type LogoCellProps = {
	label: string;
	subcategory?: PublicCategoryTree | undefined;
	imgUrl: string;
	href: string;
};

export function LogoCell({ label, subcategory, imgUrl, href }: LogoCellProps) {
	return (
		<div className="flex gap-3 items-center">
			<Link href={href}>
				<Avatar className="border h-12 w-12 rounded-sm overflow-hidden">
					<AvatarImage
						className="rounded-none"
						src={imgUrl}
						alt={`Photo of "${label}"`}
					/>
				</Avatar>
			</Link>

			<div>
				<div className="font-medium hover:text-primary transition-colors max-w-60 truncate">
					<Link href={href}>{label}</Link>
				</div>

				{subcategory && (
					<span className="text-muted-foreground text-xs">
						{subcategory?.name}
					</span>
				)}
			</div>
		</div>
	);
}
