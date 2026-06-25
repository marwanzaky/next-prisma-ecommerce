import { Injectable } from "@nestjs/common";

import { ContentListUnion, GoogleGenAI, ToolListUnion } from "@google/genai";
import { Product, ProductWithCategory } from "@repo/database";

@Injectable()
export class GeminiService {
	ai = new GoogleGenAI({});

	formatProductText(data: ProductWithCategory): string {
		return `Product: ${data.name}. Category: ${data.category?.name ?? "Uncategory"}. Description: ${data.description}`;
	}

	async generateEmbedding(text: string) {
		const response = await this.ai.models.embedContent({
			model: "gemini-embedding-2",
			contents: text,
			config: {
				outputDimensionality: 1536,
			},
		});

		return response.embeddings?.[0]?.values;
	}

	async generateContent(
		contents: ContentListUnion,
		tools?: ToolListUnion,
	): Promise<string | undefined> {
		const response = await this.ai.models.generateContent({
			model: "gemini-3.1-flash-lite",
			contents,
			config: {
				tools,
			},
		});

		return response.text;
	}
}
