export function initials(fullname: string): string {
	return fullname
		.split(" ")
		.map((word) => word[0])
		.join("")
		.toUpperCase();
}

export function stringToDate(str: string): string {
	const date = new Date(str);
	return date.toLocaleDateString("en-us", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

export function createProductSlug(name: string, id: string): string {
	const slug = name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");

	return `${slug}-${id}`;
}
