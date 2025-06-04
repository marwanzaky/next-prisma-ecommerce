import ProductDetails from "@components/productDetails";
import { productsService } from "@redux/services/productsService";

import { IProduct } from "_shared/interfaces";

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const product = await getProduct(id);

	return <ProductDetails product={product} />;
}

async function getProduct(id: string): Promise<IProduct> {
	return await productsService.getProduct(id);
}

export async function generateStaticParams() {
	const data = await productsService.getAllProducts();

	return data.map((product) => ({
		id: product._id,
	}));
}
