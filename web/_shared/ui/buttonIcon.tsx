import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@lib/utils";
import Icon from "_shared/ui/icon";

const buttonIconVariants = cva(
	[
		"inline-flex items-center justify-center whitespace-nowrap",
		"bg-white w-[2.375rem] h-[2.375rem] rounded-full",
		"hover:bg-gray-200",
		"transition-colors",
	],
	{
		variants: {},
		defaultVariants: {},
	},
);

export interface ButtonIconProps
	extends
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonIconVariants> {
	asChild?: boolean;
	styleClass?: string;
	icon: string;
	children?: React.ReactNode;
}

const ButtonIcon = React.forwardRef<HTMLButtonElement, ButtonIconProps>(
	(
		{ className, styleClass, icon, children, asChild = false, ...props },
		ref,
	) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn("group", buttonIconVariants({}), className)}
				ref={ref}
				{...props}
			>
				<Icon
					className={cn(
						"group-hover:filter-custom-primary-foreground",
						styleClass,
					)}
					icon={icon}
				/>

				{children}
			</Comp>
		);
	},
);
ButtonIcon.displayName = "ButtonIcon";

export { ButtonIcon, buttonIconVariants };
