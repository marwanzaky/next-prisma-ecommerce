import { Button } from "react-email";
import * as React from "react";

interface EmailButtonProps {
	className?: string;
	href: string;
	children: React.ReactNode;
}

export const EmailButton = ({
	className,
	href,
	children,
}: EmailButtonProps) => {
	return (
		<Button
			href={href}
			className={`bg-fg font-16 text-fg-inverted inline-block rounded-lg px-7 py-4 text-center font-sans leading-6 ${className}`}
		>
			{children}
		</Button>
	);
};

EmailButton.PreviewProps = {
	href: "#",
	children: "Click Me",
} as EmailButtonProps;

export default EmailButton;
