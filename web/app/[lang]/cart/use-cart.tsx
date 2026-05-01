"use client";

import { useMemo } from "react";
import { useDispatch } from "react-redux";

import { useQuery } from "@tanstack/react-query";

import { categoriesService } from "@/redux/services/categories-service";
import { paymentsService } from "@/redux/services/payments-service";
import { AppDispatch, useAppSelector } from "@/redux/store";
import {
	deleteCartItemAsync,
	updateCartItemQuantityAsync,
} from "@/redux/thunks/cart-thunks";

import { useI18n } from "@/components/layout/i18n-provider";

import { formatPrice } from "@/lib/format";

import { CartItem, getCartColumns } from "./columns";

export function useCart() {
	const dispatch = useDispatch<AppDispatch>();

	const { locale, t } = useI18n();
	const { items } = useAppSelector((state) => state.cartReducer);

	const { data: categoryTree } = useQuery({
		queryKey: ["category-tree"],
		queryFn: () => categoriesService.getCategoryTree(),
		staleTime: 1000 * 60 * 5,
	});

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
			subtotal: formatPrice(subtotalValue, locale),
			discount: formatPrice(discountValue, locale),
			discountPercent: `${discountPercentValue.toFixed(0)}%`,
			total: formatPrice(totalValue + shippingValue, locale),
		};
	}, [items, locale]);

	const columns = getCartColumns({
		categoryTree,
		t,
		locale,
		onQuantityChange(value, row) {
			dispatch(
				updateCartItemQuantityAsync({
					productId: row._id,
					quantity: value,
				}),
			);
		},
		deleteAction(row) {
			dispatch(deleteCartItemAsync({ product: row }));
		},
	});

	const tableData: CartItem[] = items.map((item) => ({
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
