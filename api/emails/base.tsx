import {
	Body,
	Column,
	Container,
	Head,
	Html,
	Img,
	Link,
	Preview,
	Row,
	Section,
	Tailwind,
	Text,
} from "react-email";
import { barebonesBoxedTailwindConfig } from "./theme";
import { BarebonesFonts } from "./theme-fonts";
import * as React from "react";

export interface BaseProps {
	companyName: string;
	preview: string;
	unsubscribe?: boolean;
	children: React.ReactNode;
}

export const Base = ({
	companyName,
	preview,
	unsubscribe = false,
	children,
}: BaseProps) => {
	const baseUrl = "https://react-email-demo-qf66lxnl3-resend.vercel.app/";

	return (
		<Tailwind config={barebonesBoxedTailwindConfig}>
			<Head>
				<BarebonesFonts />
			</Head>

			<Html>
				<Body className="bg-bg-2 m-0 text-center font-sans">
					<Preview>{preview}</Preview>

					<Container className="mobile:mt-0 mx-auto mt-8 w-full max-w-[640px]">
						<Section>
							<Section className="bg-bg mobile:px-2 px-6 py-4">
								{/* Header */}
								<Section className="mb-3 px-6">
									<Row>
										<Column className="w-1/2 py-[7px] align-middle">
											<Img
												src={`${baseUrl}/static/shared/logo-black.png`}
												alt="Logo"
												width={23}
												className="block"
											/>
										</Column>
										<Column
											align="right"
											className="w-1/2 py-[7px] align-middle"
										>
											<Text className="font-13 m-0 text-right font-sans">
												<span className="text-fg-3">{companyName}</span>
											</Text>
										</Column>
									</Row>
								</Section>

								{/* Main Card Content */}
								<Section className="bg-bg-2 mobile:px-6 mobile:py-12 rounded-[8px] px-[40px] py-[48px] text-left">
									{children}
								</Section>

								{/* Footer */}
								<Section className="bg-bg">
									<Row>
										<Column className="px-6 py-10 text-center">
											<Text className="font-13 text-fg-3 mx-auto mt-0 mb-8 max-w-[280px] text-center font-sans">
												Barebones is the catchy slogan that perfectly
												encapsulates the vision of our company.
											</Text>

											<Section className="mb-8">
												<Link
													href="https://example.com/"
													className="inline-block px-2 align-middle"
												>
													<Img
														src={`${baseUrl}/static/shared/social-x-black.png`}
														alt="X"
														width={18}
													/>
												</Link>
												<Link
													href="https://example.com/"
													className="inline-block px-2 align-middle"
												>
													<Img
														src={`${baseUrl}/static/shared/social-in-black.png`}
														alt="LinkedIn"
														width={18}
													/>
												</Link>
												<Link
													href="https://example.com/"
													className="inline-block px-2 align-middle"
												>
													<Img
														src={`${baseUrl}/static/shared/social-yt-black.png`}
														alt="YouTube"
														width={18}
													/>
												</Link>
												<Link
													href="https://example.com/"
													className="inline-block px-2 align-middle"
												>
													<Img
														src={`${baseUrl}/static/shared/social-gh-black.png`}
														alt="GitHub"
														width={18}
													/>
												</Link>
											</Section>

											<Text className="font-11 text-fg-3 mt-4 mb-5 text-center font-sans">
												123 Market Street, Floor 1
												<br />
												Tech City, CA, 94102
											</Text>
											{unsubscribe && (
												<Text className="font-11 text-fg-3 m-0 text-center font-sans">
													<Link
														href="https://example.com/"
														className="text-fg-3"
													>
														Unsubscribe
													</Link>{" "}
													from {companyName} marketing emails.
												</Text>
											)}
										</Column>
									</Row>
								</Section>
							</Section>
						</Section>
					</Container>
				</Body>
			</Html>
		</Tailwind>
	);
};

Base.PreviewProps = {
	companyName: "Mamolio",
	preview: "Reset your password",
	unsubscribe: true,
} as BaseProps;

export default Base;
