import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Product } from "@products/entities/product.entity";
import { User } from "@users/entities/user.entity";
import { ReviewEntity } from "@shared/review.type";

type ReviewDocumentType = Omit<
	ReviewEntity,
	"_id" | "createdAt" | "updatedAt" | "product" | "user"
> & {
	product: mongoose.Schema.Types.ObjectId;
	user: mongoose.Schema.Types.ObjectId;
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
		type: String,
		trim: true,
	})
	description?: string;

	@Prop({
		type: mongoose.Schema.ObjectId,
		ref: Product.name,
		required: [true, "A review must belong to a product"],
	})
	product!: mongoose.Schema.Types.ObjectId;

	@Prop({
		type: mongoose.Schema.ObjectId,
		ref: User.name,
		required: [true, "A review must belong to a user"],
	})
	user!: mongoose.Schema.Types.ObjectId;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.pre(/^find/, function (next) {
	(this as any)
		.populate({
			path: "product",
			select: "name",
		})
		.populate({
			path: "user",
			select: "name photoUrl",
		});

	next();
});
