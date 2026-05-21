import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { Public } from "@/app/auth/auth.guard";

import { Roles } from "@/decorators/roles.decorator";
import { PrismaService } from "@/prisma.service";

import { SendContactMessageDto } from "./dto/send-contact-message.dto";
import { UpdateContactMessageStatusDto } from "./dto/update-contact-message-status.dto";

@Controller("contact-messages")
@ApiTags("Contact Messages")
export class ContactMessagesController {
	constructor(private prisma: PrismaService) {}

	@Get()
	@Roles("admin")
	@ApiOperation({
		summary: "Get all contact messages (admin)",
	})
	async getAll() {
		return this.prisma.contactMessage.findMany();
	}

	@Patch(":id")
	@Roles("admin")
	@ApiOperation({
		summary: "Update contact message status (admin)",
	})
	async updateStatus(
		@Param("id") id: string,
		@Body() body: UpdateContactMessageStatusDto,
	) {
		return this.prisma.contactMessage.update({
			where: { id },
			data: {
				status: body.status,
			},
		});
	}

	@Post()
	@Public()
	@ApiOperation({
		summary: "Send a contact message",
	})
	async create(@Body() body: SendContactMessageDto) {
		const { name, email, message, subject } = body;

		return this.prisma.contactMessage.create({
			data: {
				name,
				email,
				message,
				subject,
			},
		});
	}

	@Delete(":id")
	@Roles("admin")
	@ApiOperation({
		summary: "Delete contact message (admin)",
	})
	async delete(@Param("id") id: string) {
		return this.prisma.contactMessage.delete({
			where: { id },
		});
	}
}
