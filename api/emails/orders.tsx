import { Column, Heading, Img, Row, Section, Text } from "react-email";
import * as React from "react";
import { OrderItemWithVariant } from "@repo/database";
import EmailButton from "./button";
import { formatPrice } from "@repo/types";
import Base from "./base";

export interface OrderConfirmationProps {
	companyName: string;
	customerName: string;
	orderNumber: string;
	orderDate: string;
	items: OrderItemWithVariant[];
	subtotal: string;
	shipping: string;
	total: string;
	receiptUrl: string;
}

export const OrderConfirmationEmail = ({
	companyName,
	customerName,
	orderNumber,
	orderDate,
	items,
	subtotal,
	shipping,
	total,
	receiptUrl,
}: OrderConfirmationProps) => {
	return (
		<Base
			companyName={companyName}
			preview={`Your order #${orderNumber} has been confirmed!`}
		>
			<Heading as="h1" className="font-28 text-fg m-0 mb-3 font-sans text-left">
				Thank you for your order, {customerName}!
			</Heading>

			<Text className="font-15 text-fg-2 mt-0 mb-6 font-sans">
				We&apos;re preparing your items for shipment. Below you&apos;ll find
				your order details and summary.
			</Text>

			{/* Order Meta Details */}
			<Section className="border-b border-solid border-gray-200 pb-4 mb-6">
				<Row>
					<Column className="w-1/2">
						<Text className="font-11 text-fg-3 m-0 uppercase tracking-wider">
							Order Number
						</Text>
						<Text className="font-14 text-fg m-0 font-bold font-sans">
							#{orderNumber}
						</Text>
					</Column>
					<Column className="w-1/2 text-right">
						<Text className="font-11 text-fg-3 m-0 uppercase tracking-wider">
							Order Date
						</Text>
						<Text className="font-14 text-fg m-0 font-bold font-sans">
							{orderDate}
						</Text>
					</Column>
				</Row>
			</Section>

			{/* Line Items List */}
			<Section className="mb-6">
				{items.map((item) => (
					<Row key={item.id} className="mb-4">
						<Column className="w-[64px] pr-3 align-middle">
							<Img
								src={item.variant?.imgUrls[0]}
								alt={item.name}
								width={64}
								height={64}
								className="rounded-md object-cover bg-gray-100"
							/>
						</Column>

						<Column className="align-middle">
							<Text className="font-14 text-fg m-0 font-bold font-sans">
								{item.name}
							</Text>

							{item.variant?.title && (
								<Text className="font-13 text-fg-2 m-0 mt-0.5 font-sans">
									{item.variant.title}
								</Text>
							)}

							<Text className="font-13 text-fg-3 m-0 font-sans">
								Qty: {item.quantity}
							</Text>
						</Column>

						<Column className="align-middle text-right" align="right">
							<Text className="font-14 text-fg m-0 font-bold font-sans">
								{formatPrice(item.price / 100, "en")}
							</Text>
						</Column>
					</Row>
				))}
			</Section>

			{/* Financial Breakdown */}
			<Section className="border-t border-solid border-gray-200 pt-4 mb-8">
				<Row className="mb-2">
					<Column>
						<Text className="font-14 text-fg-2 m-0">Subtotal</Text>
					</Column>
					<Column align="right">
						<Text className="font-14 text-fg-2 m-0">{subtotal}</Text>
					</Column>
				</Row>
				<Row className="mb-2">
					<Column>
						<Text className="font-14 text-fg-2 m-0">Shipping</Text>
					</Column>
					<Column align="right">
						<Text className="font-14 text-fg-2 m-0">{shipping}</Text>
					</Column>
				</Row>
				<Row className="mt-4 pt-2 border-t border-dashed border-gray-200">
					<Column>
						<Text className="font-16 text-fg m-0 font-bold">Total</Text>
					</Column>
					<Column align="right">
						<Text className="font-18 text-fg m-0 font-bold">{total}</Text>
					</Column>
				</Row>
			</Section>

			{/* Action Button */}
			<Section className="text-center">
				<EmailButton className="px-0 w-full" href={receiptUrl}>
					View Full Receipt / Track Order
				</EmailButton>
			</Section>
		</Base>
	);
};

OrderConfirmationEmail.PreviewProps = {
	companyName: "Mamolio",
	customerName: "Alex Jones",
	orderNumber: "MAM-84920",
	orderDate: "June 15, 2026",
	subtotal: "$120.00",
	shipping: "$5.00",
	total: "$125.00",
	receiptUrl: "https://mamolio.com",
	items: [
		{
			id: "1",
			name: "Classic Sneakers",
			quantity: 1,
			price: 8500,
			variant: {
				title: "Beige",
				imgUrls: [
					"https://res.cloudinary.com/dh82dgakg/image/upload/v1780518398/products/rsn6h9hkybg7glb0knhc.jpg",
				],
			},
		},
		{
			id: "2",
			name: "Classic Sneakers",
			quantity: 1,
			price: 3500,
			variant: {
				title: "Blue",
				imgUrls: [
					"https://res.cloudinary.com/dh82dgakg/image/upload/v1780518522/products/pnap0lbzrolh9slozkmk.jpg",
				],
			},
		},
	],
} as OrderConfirmationProps;

export default OrderConfirmationEmail;
