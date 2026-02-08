import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";

import { Public } from "src/auth/auth.guard";
import { ContactMessagesService } from "./contact-messages.service";
import { SendContactMessageDto } from "./dto/send-contact-message.dto";

@Controller("contact-messages")
export class ContactMessagesController {
	constructor(private contactMessagesService: ContactMessagesService) {}

	@Get()
	@ApiOperation({
		summary: "Get all contact messages (admin)",
	})
	async getAll() {
		return this.contactMessagesService.find();
	}

	@Post()
	@Public()
	@ApiOperation({
		summary: "Send a contact message",
	})
	async create(@Body() body: SendContactMessageDto) {
		const { name, email, message, subject } = body;

		return this.contactMessagesService.create({
			name,
			email,
			message,
			subject,
		});
	}

	@Delete(":id")
	@ApiOperation({
		summary: "Delete contact message",
	})
	async delete(@Param("id") id: string) {
		return this.contactMessagesService.findByIdAndDelete(id);
	}
}
