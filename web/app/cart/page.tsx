"use client";

import { useRouter } from "next/navigation";

import { useCart } from "@hooks/useCart";

import { Table } from "_shared/components/table";
import { Section } from "_shared/components/section";
import { paymentsService } from "@redux/services/paymentsService";
import { TypographyH3, TypographyH4 } from "_shared/shadcn/typography";
import ProductCart from "_shared/ui/productCart";
import { Button } from "_shared/shadcn/button";

export default function Page() {
	const router = useRouter();

	const { items, columns, tableData, cartTotalStr, similarProducts } =
		useCart();

	const checkout: React.MouseEventHandler<HTMLButtonElement> = async (
		event,
	) => {
		event.preventDefault();

		const res = await paymentsService.createCheckoutSession(
			items.map((item) => ({
				id: item.product._id,
				quantity: item.quantity,
			})),
		);

		(window as Window).location = res.url;
	};

	return (
		<>
			<Section>
				{items.length > 0 ? (
					<div>
						<TypographyH4 className="text-center mb-2 lg:mb-4">
							Your Cart
						</TypographyH4>

						<Table className="mb-8" columns={columns} data={tableData} />

						<div className="flex flex-col items-end mb-5">
							<div>Subtotal&emsp;{cartTotalStr}</div>

							<div className="text-xs text-muted-foreground">
								Taxes and shipping calculated at checkout
							</div>
						</div>

						<div className="flex justify-end items-end">
							<Button>Check out</Button>
						</div>
					</div>
				) : (
					<div className="h-48 flex flex-col justify-center">
						<TypographyH4 className="text-center mb-2 lg:mb-4">
							Your cart is empty
						</TypographyH4>

						<div className="flex justify-center">
							<Button onClick={() => router.push("/products")}>
								Continue shopping
							</Button>
						</div>
					</div>
				)}
			</Section>

			{items.length === 0 && similarProducts && (
				<Section className="space-y-2 lg:space-y-4">
					<TypographyH3 className="text-center lg:text-left">
						Featured collection
					</TypographyH3>

					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-4">
						{similarProducts.map((item) => (
							<ProductCart key={item._id} data={item} />
						))}
					</div>
				</Section>
			)}
		</>
	);
}
