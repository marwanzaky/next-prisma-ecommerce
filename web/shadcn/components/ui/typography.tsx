import { cn } from "@/lib/utils";

const headingVariants = {
	h1: "scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance",
	h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-10",
	h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
	h4: "scroll-m-20 text-xl font-semibold tracking-tight",
};

type HeadingProps = {
	as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	variant?: keyof typeof headingVariants;
	className?: string;
	children: React.ReactNode;
};

export function Heading({
	as: Tag,
	variant,
	className,
	children,
}: HeadingProps) {
	return (
		<Tag
			className={cn(
				headingVariants[variant || (Tag as keyof typeof headingVariants)],
				className,
			)}
		>
			{children}
		</Tag>
	);
}

type Typography = {
	className?: string;
	children: React.ReactNode;
};

export function TypographyP({ className, children }: Typography) {
	return (
		<p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}>
			{children}
		</p>
	);
}

export function TypographyMuted({ className, children }: Typography) {
	return <p className={cn("text-muted-foreground", className)}>{children}</p>;
}
