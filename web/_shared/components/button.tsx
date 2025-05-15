"use client";

import clsx from "clsx";
import { cva, VariantProps } from "class-variance-authority";

const buttonVariants = cva("leading-none", {
	variants: {
		variant: {
			primary: "bg-primary hover:bg-primary-dark text-white",
		},
		size: {
			sm: "text-sm py-1.5 px-2 rounded-lg",
			md: "text-base px-[30px] h-14 rounded-xl",
		},
	},
	defaultVariants: {
		variant: "primary",
		size: "sm",
	},
});

type ButtonProps = VariantProps<typeof buttonVariants> & {
	className?: string;
	type?: "submit" | "reset" | "button";
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	children: React.ReactNode;
};

export const Button = ({
	className,
	type,
	onClick,
	children,
	variant,
	size,
}: ButtonProps) => {
	return (
		<button
			className={clsx(buttonVariants({ variant, size }), className)}
			type={type}
			onClick={onClick}
		>
			{children}
		</button>
	);
};
