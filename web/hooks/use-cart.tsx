"use client";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@redux/store";

import {
	deleteCartItemAsync,
	updateCartItemQuantityAsync,
} from "@redux/thunks/cart-thunks";

import { IProduct } from "@shared/interfaces";
import { Column } from "@shared/components/ui/table";
import { LogoCell } from "@shared/components/ui/table/cells/logo-cell";

import { paymentsService } from "@redux/services/payments-service";
import { createProductSlug } from "@utils/string-utils";
import { useMemo } from "react";
import { formatCurrency } from "@utils/format-price";

type CartItem = IProduct & { imgUrl: string; quantity: number; total: number };

export function useCart() {
	const dispatch = useDispatch<AppDispatch>();

	const { items } = useAppSelector((state) => state.cartReducer);

	const { total, subtotal, discount, discountPercent } = useMemo(() => {
		if (items.length === 0) {
			return {
				total: "",
				subtotal: "",
				discount: "",
				discountPercent: "",
			};
		}

		const subtotalValue = items.reduce(
			(acc, item) => acc + (item.product.priceCompare * item.quantity) / 100,
			0,
		);

		const totalValue = items.reduce(
			(acc, item) => acc + (item.product.price * item.quantity) / 100,
			0,
		);

		const discountValue = subtotalValue - totalValue;
		const discountPercentValue =
			subtotalValue > 0 ? (discountValue / subtotalValue) * 100 : 0;

		const shippingValue = 0;

		return {
			subtotal: formatCurrency(subtotalValue),
			discount: formatCurrency(discountValue),
			discountPercent: `${discountPercentValue.toFixed(0)}%`,
			total: formatCurrency(totalValue + shippingValue),
		};
	}, [items]);

	const columns: Column<CartItem>[] = [
		{
			header: "Product",
			field: "imgUrl",
			type: "custom",
			className: "sm:w-[50%]",
			render: (value, row) => (
				<LogoCell
					href={`products/${createProductSlug(row.name, row._id)}`}
					label={row.name}
					imgUrl={value}
				/>
			),
		},
		{
			header: "Price",
			field: "price",
			type: "usd",
			className: "w-[10%]",
		},
		{
			header: "Quantity",
			field: "quantity",
			type: "number-input",
			className: "w-[10%]",
			onChange: (value, row) => {
				dispatch(
					updateCartItemQuantityAsync({
						productId: row._id,
						quantity: value,
					}),
				);
			},
		},
		{
			header: "Total",
			field: "total",
			type: "usd",
			className: "hidden sm:w-[10%] sm:table-cell",
		},
		{
			field: "_id",
			header: "",
			type: "action",
			action: (row) => {
				dispatch(deleteCartItemAsync({ product: row }));
			},
			actionIcon: "delete",
			className: "w-9.5",
		},
	];

	const tableData = items.map((item) => ({
		...item.product,
		imgUrl: item.product.imgUrls[0],
		quantity: item.quantity,
		total: item.product.price * item.quantity,
	}));

	const checkout: React.MouseEventHandler<HTMLButtonElement> = async (
		event,
	) => {
		event.preventDefault();

		const response = await paymentsService.createCheckoutSession(
			items.map((item) => ({
				id: item.product._id,
				quantity: item.quantity,
			})),
		);

		(window as Window).location = response.url;
	};

	return {
		items,
		columns,
		tableData,

		total,
		subtotal,
		discount,
		discountPercent,

		checkout,
	};
}
