"use client";

import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import { updateCartItemQuantityAsync } from "@/redux/slices/cart-slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";

import { categoriesService } from "@/services/categories-service";
import { paymentsService } from "@/services/payments-service";

import { useI18n } from "@/components/layout/i18n-provider";

import { formatPrice } from "@/lib/string-utils";

import { useCart } from "@/hooks/use-cart";

import { CartItem, getCartColumns } from "./columns";

export function useCartPage() {
	const dispatch = useAppDispatch();

	const { locale, t } = useI18n();
	const { items } = useAppSelector((state) => state.cart);

	const { removeFromCart } = useCart();

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
				updateCartItemQuantityAsync({ productId: row._id, quantity: value }),
			);
		},
		deleteAction(row) {
			removeFromCart(row._id);
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
