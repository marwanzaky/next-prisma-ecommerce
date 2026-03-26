import Icon from "@shared/ui/icon";
import { Badge } from "@shared/shadcn/badge";

export type ChipProps = {
	children?: React.ReactNode;
	onClick?: React.MouseEventHandler<HTMLImageElement>;
};

export function Chip({ children, onClick }: ChipProps) {
	return (
		<Badge variant="secondary" className="space-x-1 shrink-0">
			<div>{children}</div>
			<Icon
				className="cursor-pointer hover:filter-primary-dark"
				src="icons/close.svg"
				size={16}
				onClick={onClick}
			/>
		</Badge>
	);
}
