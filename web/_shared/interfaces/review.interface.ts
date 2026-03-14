import { User } from "@shared/user.type";
import { IProduct } from "./product.interface";

export interface IReview {
	_id: string;
	rating: number;
	description: string;
	product: IProduct;
	user: User;
	createdAt: string;
}
