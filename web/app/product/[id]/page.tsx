"use client";

import ProductDetails from "@components/productDetails";
import { productsService } from "@redux/services/productsService";
import { useQuery } from "@tanstack/react-query";

import { useParams } from "next/navigation";

export default function Page() {
	const params = useParams<{ id: string }>();

	const { data, isLoading } = useQuery({
		queryKey: ["product", params.id],
		queryFn: () => productsService.getProduct(params.id),
		staleTime: 1000 * 60 * 5,
	});

	return isLoading ? <></> : data ? <ProductDetails product={data} /> : <></>;
}
