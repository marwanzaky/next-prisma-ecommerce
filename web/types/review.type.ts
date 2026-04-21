import { User } from "@/shared/types/user.type";

import { IProduct } from "./product.type";

export interface IReview {
	_id: string;
	rating: number;
	description: string;
	product: IProduct;
	user: User;
	createdAt: string;
}
