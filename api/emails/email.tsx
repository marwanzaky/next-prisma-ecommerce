import { Heading, Img, Section, Text } from "react-email";

import * as React from "react";
import EmailButton from "./button";
import Base from "./base";

interface EmailProps {
	title: string;
	description: string;
	buttonText: string;
	companyName: string;
	url: string;
	preview: string;
}

export const Email = ({
	title,
	description,
	buttonText,
	companyName,
	url,
	preview,
}: EmailProps) => {
	const baseUrl = "https://react-email-demo-qf66lxnl3-resend.vercel.app/";

	return (
		<Base companyName={companyName} preview={preview} unsubscribe>
			<Section className="mb-3">
				<Img
					src={`${baseUrl}/static/shared/logo-black.png`}
					alt="Logo"
					width={48}
					className="mx-auto mb-5 block"
				/>

				<Heading as="h1" className="font-28 text-center text-fg m-0 font-sans">
					{title}
				</Heading>
			</Section>

			<Text className="font-16 text-fg-2 mx-auto mt-0 mb-8 max-w-[380px] text-center font-sans">
				{description}
			</Text>

			<Section className="mb-6 text-center">
				<EmailButton href={url}>{buttonText}</EmailButton>
			</Section>

			<Text className="font-13 text-fg-3 mx-auto mt-8 mb-0 max-w-[400px] text-center font-sans">
				If you didn&apos;t request this, please ignore this email. Your password
				won&apos;t change until you access the link above and create a new one.
			</Text>
		</Base>
	);
};

Email.PreviewProps = {
	title: "Thanks for signing up.",
	description: "Verify your email by clicking this link.",
	buttonText: "Verify",
	companyName: "Mamolio",
	preview: "Reset your password",
	url: "#",
} satisfies EmailProps;

export default Email;
