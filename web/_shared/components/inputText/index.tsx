import Icon from "_shared/ui/icon";
import { cva } from "class-variance-authority";
import clsx from "clsx";

const inputTextVariants = cva(
	[
		"w-full",
		"rounded-xl bg-custom-background-foreground",
		"outline-none shadow-[0_0_0_1pt_#ecf0f1] focus:shadow-[0_0_0_2pt_cornflowerblue] transition-shadow",
	],
	{
		variants: {
			size: {
				sm: "px-[25px] h-[48px]",
				md: "px-[25px] h-[62px]",
			},
		},
		defaultVariants: {
			size: "md",
		},
	},
);

type InputTextProps = Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	"size"
> & {
	styleClass?: string;
	icon?: string;
	size?: "md" | "sm";
	message?: string;
};

export function InputText({
	className,
	styleClass,
	icon,
	size,
	message,
	...inputProps
}: InputTextProps) {
	return (
		<div className={className}>
			<div className="relative">
				<input
					className={clsx(inputTextVariants({ size }), styleClass)}
					{...inputProps}
				/>

				{icon && (
					<div className="absolute top-[calc(50%-12px)] right-[25px]">
						<Icon className="filter-custom-placeholder" icon={icon} />
					</div>
				)}
			</div>

			{message && (
				<div className="text-red-600 text-xs leading-none mt-2">{message}</div>
			)}
		</div>
	);
}
