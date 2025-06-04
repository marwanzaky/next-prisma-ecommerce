import { cn } from "@lib/utils";
import Stars from "_shared/components/stars";
import { initials, stringToDate } from "@utils/stringUtils";
import { IProduct } from "_shared/interfaces";

export default function Reviews({ product }: { product: IProduct }) {
	return (
		<div>
			{product.reviews?.map((review, i) => (
				<div key={`review ${i}`} className="mb-8 last:mb-0 flex">
					<div
						className={cn(
							"mr-4 shrink-0 flex justify-center items-center w-10 h-10 rounded-full text-lg",
							"text-custom-primary-foreground bg-custom-primary-background",
						)}
					>
						{initials(review.user.name)}
					</div>

					<div>
						<div className="leading-none mb-0.5">
							{review.user.name}&ensp;
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
						<p className="text-custom-grey">{review.description}</p>
					</div>
				</div>
			))}
		</div>
	);
}
