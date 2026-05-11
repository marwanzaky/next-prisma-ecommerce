import React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { Slot } from "@radix-ui/react-slot";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/shadcn/components/ui/avatar";

import { cn } from "@/lib/utils";

const imageButtonVariants = cva(
	[
		"inline-flex items-center justify-center whitespace-nowrap cursor-pointer disabled:pointer-events-none disabled:opacity-50",
		"bg-white w-9.5 h-9.5 rounded-full",
		"hover:bg-gray-200",
		"transition-colors",
	],
	{
		variants: {},
		defaultVariants: {},
	},
);

export interface ImageIconProps
	extends
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof imageButtonVariants> {
	asChild?: boolean;
	imgUrl: string | undefined;
	fallback: string;
	alt: string;
}

const ImageButton = React.forwardRef<HTMLButtonElement, ImageIconProps>(
	({ className, imgUrl, alt, fallback, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(imageButtonVariants({}), className)}
				ref={ref}
				{...props}
			>
				<Avatar className="w-6 h-6">
					<AvatarImage src={imgUrl || undefined} alt={alt} />
					<AvatarFallback>{fallback}</AvatarFallback>
				</Avatar>
			</Comp>
		);
	},
);
ImageButton.displayName = "ImageButton";

export { ImageButton, imageButtonVariants };
