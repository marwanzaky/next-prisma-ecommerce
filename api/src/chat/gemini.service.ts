import { Injectable } from "@nestjs/common";

type GeminiResponse = {
	candidates: [
		{
			content: {
				parts: [{ text: string }];
				role: string;
			};
		},
	];
	modelVersion: string;
};

type GeminiRequestBody = {
	contents: {
		role: "user" | "model";
		parts: { text: string }[];
	}[];
};

@Injectable()
export class GeminiService {
	async sendMessage(options: {
		promptContent: string;
		systemContent: string;
		previousChat: string;
	}) {
		const { promptContent, systemContent, previousChat } = options;

		try {
			const data = await this.request({
				contents: [
					{ role: "user", parts: [{ text: systemContent }] },
					{ role: "model", parts: [{ text: previousChat }] },
					{ role: "user", parts: [{ text: promptContent }] },
				],
			});

			return data.candidates[0].content.parts[0].text;
		} catch (error) {
			console.log("err", error);
			return `An error occurred: ${error}`;
		}
	}

	async request(body: GeminiRequestBody): Promise<GeminiResponse> {
		const model = process.env.AI_MODEL || "gemini-2.0-flash";
		const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
		const response = await fetch(endpoint, {
			method: "POST",
			body: JSON.stringify(body),
		});

		return response.json();
	}
}
