import { clientFetch } from "@/lib/api-client";

export const uploadsService = {
	uploadFile: (file: File) => {
		const formData = new FormData();
		formData.append("file", file);
		return clientFetch<string>("/uploads", {
			method: "POST",
			body: formData,
		});
	},
};
