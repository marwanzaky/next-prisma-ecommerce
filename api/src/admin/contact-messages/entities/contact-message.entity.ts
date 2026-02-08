import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

import { IContactMessage } from "src/_interfaces/contact-message.interface";

@Schema({
	timestamps: true,
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
})
export class ContactMessage
	extends Document
	implements Omit<IContactMessage, "_id">
{
	@Prop({
		type: String,
		required: true,
		trim: true,
	})
	name!: string;

	@Prop({
		type: String,
		required: true,
		lowercase: true,
		trim: true,
	})
	email!: string;

	@Prop({
		type: String,
		required: true,
		trim: true,
	})
	subject!: string;

	@Prop({
		type: String,
		required: true,
	})
	message!: string;

	@Prop({
		type: String,
		enum: ["new", "read", "replied"],
		default: "new",
	})
	status!: "new" | "read" | "replied";
}

export const ContactMessageSchema =
	SchemaFactory.createForClass(ContactMessage);
