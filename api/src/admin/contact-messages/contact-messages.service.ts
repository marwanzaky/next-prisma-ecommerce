import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ContactMessage } from "./entities/contact-message.entity";

import mongoose, { Model } from "mongoose";
import {
	IContactMessageStatus,
	ICreateContactMessage,
} from "src/_interfaces/contact-message.interface";

@Injectable()
export class ContactMessagesService {
	constructor(
		@InjectModel(ContactMessage.name)
		private contactMessage: Model<ContactMessage>,
	) {}

	async create(params: ICreateContactMessage): Promise<ContactMessage> {
		const { name, email, subject, message } = params;

		const contactMessage = await this.contactMessage.create({
			name,
			email,
			subject,
			message,
		});

		return contactMessage.save();
	}

	async find(): Promise<ContactMessage[]> {
		return this.contactMessage.find();
	}

	findByIdAndUpdate(
		id: string,
		status: IContactMessageStatus,
	): Promise<ContactMessage | null> {
		return this.contactMessage.findByIdAndUpdate(
			id,
			{ status },
			{ new: true, runValidators: true },
		);
	}

	findByIdAndDelete(id: string): Promise<ContactMessage | null> {
		return this.contactMessage.findOneAndDelete({
			_id: new mongoose.Types.ObjectId(id),
		});
	}
}
