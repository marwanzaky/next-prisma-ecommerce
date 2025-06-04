import { cn } from "@lib/utils";

type Typography = {
	className?: string;
	children: React.ReactNode;
};

export function TypographyH1({ className, children }: Typography) {
	return (
		<h1
			className={cn(
				"scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
				className,
			)}
		>
			{children}
		</h1>
	);
}
