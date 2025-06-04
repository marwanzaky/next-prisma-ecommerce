import Icon from "_shared/ui/icon";
import { Badge } from "_shared/shadcn/badge";

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
				icon="close"
				size={16}
				onClick={onClick}
			/>
		</Badge>
	);
}
