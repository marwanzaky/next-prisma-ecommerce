"use client";

import { Skeleton } from "@/shadcn/components/ui/skeleton";

import { cn } from "@/lib/utils";

export default function ProductCardSkeleton() {
	return (
		<div
			className={cn(
				"flex flex-col overflow-hidden",
				"border-2 rounded-lg hover:shadow-lg transition-shadow",
			)}
		>
			<Skeleton className="aspect-square w-full h-full" />

			<div className="p-2 md:p-4">
				<Skeleton className="h-4 md:h-4.5 w-2/3 mb-1" />
				<Skeleton className="h-4 md:h-4.5 w-1/2 mb-2" />
				<Skeleton className="h-4 md:h-6 w-1/2" />
			</div>
		</div>
	);
}
