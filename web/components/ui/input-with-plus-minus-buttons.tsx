"use client";

import { cva, VariantProps } from "class-variance-authority";
import { MinusIcon, PlusIcon } from "lucide-react";

import { Button } from "@/shadcn/components/ui/button";
import { ButtonGroup } from "@/shadcn/components/ui/button-group";
import { Input } from "@/shadcn/components/ui/input";

import { cn } from "@/lib/utils";

const inputVariants = cva("text-center", {
	variants: {
		size: {
			"icon-xs": "h-6 text-xs",
			"icon-sm": "h-7 text-sm",
			"icon-lg": "h-9 text-sm",
			"icon-xl": "h-10 text-base",
		},
	},
	defaultVariants: {
		size: "icon-xl",
	},
});

type Props = VariantProps<typeof inputVariants> & {
	className?: string;
	value?: number;
	min?: number;
	max?: number;
	onChange?: (value: number) => void;
};

const InputWithPlusMinusButtons = ({
	className,
	value = 0,
	min = 0,
	max = 100,
	size = "icon-xl",
	onChange,
}: Props) => {
	const handleDecrement = () => {
		onChange?.(value - 1);
	};

	const handleIncrement = () => {
		onChange?.(value + 1);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const rawValue = e.target.value;

		if (rawValue === "") {
			onChange?.(min);
			return;
		}

		const numValue = Number(rawValue);

		if (numValue < min) {
			onChange?.(min);
		} else if (numValue > max) {
			onChange?.(max);
		} else {
			onChange?.(numValue);
		}
	};

	return (
		<ButtonGroup className={cn("w-full", className)}>
			<Button
				slot="decrement"
				variant="outline"
				size={size}
				onClick={handleDecrement}
				disabled={value <= min}
			>
				<MinusIcon className="size-3" />
				<span className="sr-only">Decrement</span>
			</Button>
			<Input
				className={cn(inputVariants({ size }))}
				type="number"
				value={value}
				onChange={handleInputChange}
			/>
			<Button
				slot="increment"
				variant="outline"
				size={size}
				onClick={handleIncrement}
				disabled={value >= max}
			>
				<PlusIcon className="size-3" />
				<span className="sr-only">Increment</span>
			</Button>
		</ButtonGroup>
	);
};

export default InputWithPlusMinusButtons;
