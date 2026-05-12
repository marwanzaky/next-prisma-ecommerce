import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { Document } from "mongoose";

import {
	ContactMessage as ContactMessageType,
	ContactMessageStatus,
	WithoutMongoMeta,
} from "@repo/types";

@Schema({
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
	timestamps: true,
})
export class ContactMessage
	extends Document
	implements WithoutMongoMeta<ContactMessageType>
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
	status!: ContactMessageStatus;
}

export const ContactMessageSchema =
	SchemaFactory.createForClass(ContactMessage);
