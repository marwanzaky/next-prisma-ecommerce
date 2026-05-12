import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import mongoose, { Document } from "mongoose";

import { Product } from "@/app/products/entities/product.entity";
import { User } from "@/app/users/entities/user.entity";

type FavoriteDocumentType = {
	user: mongoose.Types.ObjectId;
	product: mongoose.Types.ObjectId;
};

@Schema({
	timestamps: true,
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
})
export class Favorite extends Document implements FavoriteDocumentType {
	@Prop({
		type: mongoose.Schema.ObjectId,
		ref: User.name,
		required: [true, "A review must belong to a user"],
	})
	user!: mongoose.Types.ObjectId;

	@Prop({
		type: mongoose.Schema.ObjectId,
		ref: Product.name,
		required: [true, "A review must belong to a user"],
	})
	product!: mongoose.Types.ObjectId;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);
