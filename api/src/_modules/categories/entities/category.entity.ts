import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ICategory } from "src/_interfaces/category.interface";
import { Document, Types } from "mongoose";

@Schema({
	timestamps: true,
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
})
export class Category extends Document implements Omit<ICategory, "_id"> {
	@Prop({
		required: true,
		trim: true,
	})
	name!: string;

	@Prop({
		required: true,
		unique: true,
		lowercase: true,
	})
	slug!: string;

	@Prop({
		type: Types.ObjectId,
		ref: "Category",
		default: null,
	})
	parent!: Types.ObjectId | null;

	@Prop({
		default: true,
	})
	isActive!: boolean;

	@Prop({
		default: 0,
	})
	sortOrder!: number;

	@Prop({
		type: String,
		required: true,
	})
	imgUrl!: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
