import { ProductWithReviewsEntity } from "@repo/types";

import { cn } from "@/lib/utils";

import Overview from "./overview";
import Reviews from "./reviews";

export default function ProductFeedback({
	product,
}: {
	product: ProductWithReviewsEntity;
}) {
	return (
		<div
			className={cn(
				"grid grid-cols-1 md:grid-cols-2 gap-10",
				"p-4 md:p-8 border-2 rounded-lg",
			)}
		>
			<Overview product={product} />
			<Reviews product={product} />
		</div>
	);
}
