import { PrismaService } from "@/prisma.service";
import { ToolListUnion, Type } from "@google/genai";
import { Injectable } from "@nestjs/common";

export const chatbotTools: ToolListUnion = [
	{
		functionDeclarations: [
			{
				name: "getProductVariantsDetails",
				description:
					"Fetches real-time price, stock, SKU, and variant options (size, color, etc.) for a specific product name.",
				parameters: {
					type: Type.OBJECT,
					properties: {
						productName: {
							type: Type.STRING,
							description:
								"The exact or approximate name of the product to look up.",
						},
					},
					required: ["productName"],
				},
			},
		],
	},
];

@Injectable()
export class ChatService {
	constructor(private prisma: PrismaService) {}

	async getProductVariantsDetails(productName: string) {
		const product = await this.prisma.product.findFirst({
			where: {
				name: {
					path: ["en"],
					string_contains: productName,
				},
			},
			include: {
				variants: {
					include: {
						selections: {
							include: {
								option: true,
								optionValue: true,
							},
						},
					},
				},
			},
		});

		if (!product) return { error: `Product '${productName}' not found.` };

		return {
			productId: product.id,
			avgRatings: product.avgRatings,
			variants: product.variants.map((v) => ({
				sku: v.sku,
				title: v.title,
				price: v.price / 100,
				stock: v.stock,
				options: v.selections.map(
					(s) => `${s.option.name}: ${s.optionValue.value}`,
				),
			})),
		};
	}
}
