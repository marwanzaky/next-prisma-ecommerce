import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { Document, Types } from "mongoose";

import {
	CategoryEntity as CategoryEntityType,
	TranslatedText,
	WithoutMongoMeta,
} from "@repo/types";

type CategoryDocumentType = Omit<
	WithoutMongoMeta<CategoryEntityType>,
	"parent"
> & {
	parent: Types.ObjectId | null;
};

@Schema({
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
	timestamps: true,
})
export class Category extends Document implements CategoryDocumentType {
	@Prop({
		type: {
			en: { type: String, required: true, trim: true },
			fr: { type: String, required: true, trim: true },
			ar: { type: String, required: true, trim: true },
		},
		required: true,
	})
	name!: TranslatedText;

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
	})
	imgUrl!: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
