"use client";

import React, { createContext, useContext } from "react";

import { useProducts } from "../use-products";

type ProductsContextType = ReturnType<typeof useProducts>;

const ProductsContext = createContext<ProductsContextType | undefined>(
	undefined,
);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
	const products = useProducts();

	return (
		<ProductsContext.Provider value={products}>
			{children}
		</ProductsContext.Provider>
	);
}

export function useProductsContext() {
	const context = useContext(ProductsContext);

	if (!context) {
		throw new Error(
			"useProductsContext must be used within a ProductsProvider",
		);
	}

	return context;
}
