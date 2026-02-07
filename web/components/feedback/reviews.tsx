import { cn } from "@lib/utils";
import Stars from "_shared/components/stars";
import { initials, stringToDate } from "@utils/stringUtils";
import { IProduct } from "_shared/interfaces";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "_shared/components/empty";

type AvatarInitialsProps = React.InputHTMLAttributes<HTMLInputElement> & {
	name: string;
};

export function AvatarInitials({
	className,
	name,
	...props
}: AvatarInitialsProps) {
	return (
		<div
			className={cn(
				"shrink-0 flex justify-center items-center w-10 h-10 rounded-full text-lg",
				"text-custom-primary-foreground bg-custom-primary-background",
				className,
			)}
			{...props}
		>
			{initials(name)}
		</div>
	);
}

export default function Reviews({ product }: { product: IProduct }) {
	const router = useRouter();

	return (
		<div>
			{product.reviews?.length > 0 ? (
				product.reviews?.map((review, i) => (
					<div key={`review ${i}`} className="mb-8 last:mb-0 flex">
						<AvatarInitials
							role="button"
							className="mr-4"
							name={review.user.name}
							onClick={() => router.push(`/user/${review.user._id}`)}
						/>

						<div>
							<div className="leading-none mb-0.5 text-sm">
								<Link
									href={`/user/${review.user._id}`}
									className="hover:underline"
								>
									{review.user.name}
								</Link>
								&ensp;
								<span className="text-custom-grey">
									{stringToDate(review.createdAt)}
								</span>
							</div>
							<Stars
								className="mb-1"
								size={14}
								value={review.rating}
								displayTotal={false}
							/>
							<p className="text-custom-grey text-sm">{review.description}</p>
						</div>
					</div>
				))
			) : (
				<Empty className="border border-dashed h-full">
					<EmptyHeader>
						<EmptyTitle>Nothing here... yet.</EmptyTitle>
						<EmptyDescription className="max-w-xs text-pretty">
							Customers who have purchased this product have not yet submitted
							any reviews.
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			)}
		</div>
	);
}
