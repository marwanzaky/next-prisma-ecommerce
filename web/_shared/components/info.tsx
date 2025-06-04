import { useState } from "react";
import Icon from "_shared/ui/icon";
import { cn } from "@lib/utils";

export default function Info({
	display = false,
	title,
	children,
}: {
	display: boolean;
	title: string;
	children: React.ReactNode;
}) {
	const [expand, setExpand] = useState(display);

	const toggleContent: React.MouseEventHandler<HTMLDivElement> = (event) => {
		event.preventDefault();
		setExpand(!expand);
	};

	return (
		<button className={cn("block w-full text-left py-4 outline-none border-t")}>
			<div
				className="flex items-center justify-between"
				onClick={toggleContent}
			>
				<div className="font-extrabold leading-none">{title}</div>
				<Icon icon={expand ? "expand_more" : "expand_less"} />
			</div>

			<div
				className="mt-5 whitespace-pre-wrap"
				style={{ display: expand ? "block" : "none" }}
			>
				{children}
			</div>
		</button>
	);
}
