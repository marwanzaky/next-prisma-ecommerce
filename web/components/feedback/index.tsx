import { TypographyH4 } from "_shared/shadcn/typography";
import Overview from "./overview";
import Reviews from "./reviews";
import { IProduct } from "_shared/interfaces";
import { cn } from "@lib/utils";

export default function ProductFeedback({ product }: { product: IProduct }) {
	return (
		<div
			className={cn(
				"grid grid-cols-1 md:grid-cols-2 gap-10",
				"p-4 md:p-8 border-2 rounded-xl",
			)}
		>
			<Overview product={product} />
			<Reviews product={product} />
		</div>
	);
}
