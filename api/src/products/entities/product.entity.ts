import { Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Category } from "@modules/categories/entities/category.entity";
import { User } from "@users/entities/user.entity";
import { ProductEntity, RatingDistribution } from "@shared/product.types";

type ProductDocumentType = Omit<
	ProductEntity,
	"_id" | "category" | "createdAt" | "updatedAt"
> & {
	category: mongoose.Types.ObjectId | null;
};

@Schema({
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
	timestamps: true,
})
export class Product extends Document implements ProductDocumentType {
	@Prop({
		type: String,
		required: [true, "A product must have a name"],
		trim: true,
	})
	name!: string;

	@Prop({
		type: Number,
		required: [true, "A product must have a price"],
	})
	price!: number;

	@Prop({
		type: Number,
		required: [true, "A product must have a priceCompare"],
	})
	priceCompare!: number;

	@Prop({
		type: Boolean,
		default: false,
	})
	isHero!: boolean;

	@Prop({
		type: Number,
		default: 1,
	})
	stock!: number;

	@Prop({
		type: Number,
		default: 0,
	})
	avgRatings!: number;

	@Prop({
		type: Number,
		default: 0,
	})
	numReviews!: number;

	@Prop({
		type: {
			1: { type: Number, default: 0 },
			2: { type: Number, default: 0 },
			3: { type: Number, default: 0 },
			4: { type: Number, default: 0 },
			5: { type: Number, default: 0 },
		},
		default: {
			1: 0,
			2: 0,
			3: 0,
			4: 0,
			5: 0,
		},
	})
	ratingDistribution!: RatingDistribution;

	@Prop({
		type: [String],
		required: true,
	})
	imgUrls!: string[];

	@Prop({
		type: String,
		required: [true, "A product must have a description"],
		trim: true,
	})
	description!: string;

	@Prop({
		type: String,
		trim: true,
	})
	shortDescription?: string;

	@Prop({
		type: [String],
		required: [true, "A product must have tags"],
		trim: true,
	})
	tags!: string[];

	@Prop({
		type: mongoose.Schema.ObjectId,
		ref: User.name,
		required: [true, "A product must belong to a user"],
	})
	user!: mongoose.Schema.Types.ObjectId;

	@Prop({
		type: Boolean,
		default: false,
	})
	featured!: boolean;

	@Prop({
		type: mongoose.Schema.ObjectId,
		ref: Category.name,
		required: [true, "A product must have category value"],
		default: null,
	})
	category!: mongoose.Types.ObjectId | null;

	@Virtual({
		get: function (this: Product) {
			const discount = this.priceCompare - this.price;
			const discountPercent = (discount / this.priceCompare) * 100;
			return `${Math.round(discountPercent)}%`;
		},
	})
	discount!: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.virtual("reviews", {
	ref: "Review",
	foreignField: "product",
	localField: "_id",
});
