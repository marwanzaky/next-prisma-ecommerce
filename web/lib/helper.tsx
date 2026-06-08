import { UpdateProductVariant } from "@repo/database";

export function jsonToFormData(data: any) {
	const formData = new FormData();

	buildFormData(formData, data);

	return formData;
}

function buildFormData(formData: any, data: any, parentKey?: any) {
	if (data === undefined || data === null) {
		return;
	}

	if (
		data &&
		typeof data === "object" &&
		!(data instanceof Date) &&
		!(data instanceof File) &&
		!(data instanceof Blob)
	) {
		Object.keys(data).forEach((key) => {
			buildFormData(
				formData,
				data[key],
				parentKey ? `${parentKey}[${key}]` : key,
			);
		});
	} else {
		formData.append(parentKey, data);
	}
}

export function getKeptAndNewImgs(
	images: (
		| {
				url?: string | undefined;
				file?: File | undefined;
		  }
		| undefined
	)[],
) {
	const keptImgs: UpdateProductVariant["keptImgs"] = images
		.filter((img) => !!img)
		.map((img, index) => (img.url ? { url: img.url, index } : undefined))
		.filter((obj) => !!obj);

	const newImgs: UpdateProductVariant["newImgs"] = images
		.filter((img) => !!img)
		.map((img, index) => (img.file ? { file: img.file, index } : undefined))
		.filter((obj) => !!obj);

	return { keptImgs, newImgs };
}
