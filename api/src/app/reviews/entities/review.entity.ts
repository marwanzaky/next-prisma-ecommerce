import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import mongoose, { Document } from "mongoose";

import { ReviewEntity, TranslatedText, WithoutMongoMeta } from "@repo/types";

import { Product } from "@/app/products/entities/product.entity";
import { User } from "@/app/users/entities/user.entity";

type ReviewDocumentType = Omit<
	WithoutMongoMeta<ReviewEntity>,
	"product" | "user"
> & {
	product: mongoose.Types.ObjectId;
	user: mongoose.Types.ObjectId;
};

@Schema({
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
	timestamps: true,
})
export class Review extends Document implements ReviewDocumentType {
	@Prop({
		type: Number,
		min: 1,
		max: 5,
		required: [true, "A review must have a rating"],
	})
	rating!: number;

	@Prop({
		type: {
			en: { type: String, trim: true },
			fr: { type: String, trim: true },
			ar: { type: String, trim: true },
		},
	})
	description?: TranslatedText;

	@Prop({
		type: mongoose.Schema.ObjectId,
		ref: Product.name,
		required: [true, "A review must belong to a product"],
	})
	product!: mongoose.Types.ObjectId;

	@Prop({
		type: mongoose.Schema.ObjectId,
		ref: User.name,
		required: [true, "A review must belong to a user"],
	})
	user!: mongoose.Types.ObjectId;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.pre<Review>(/^find/, function () {
	this.populate({
		path: "product",
		select: "name",
	});
	this.populate({
		path: "user",
		select: "name photoUrl",
	});
});
