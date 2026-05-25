export * from "./cart.type";
export * from "./category.type";
export * from "./contact-message.type";
export * from "./product.type";
export * from "./review.type";
export * from "./user.type";

export type CreateCheckoutSession = {
	items: { id: string; quantity: number }[];
};
