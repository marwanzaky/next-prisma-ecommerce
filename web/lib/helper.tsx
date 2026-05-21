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
