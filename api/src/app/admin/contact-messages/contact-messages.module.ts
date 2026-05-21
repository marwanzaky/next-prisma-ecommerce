import { Module } from "@nestjs/common";

import { PrismaService } from "@/prisma.service";

import { ContactMessagesController } from "./contact-messages.controller";

@Module({
	providers: [PrismaService],
	controllers: [ContactMessagesController],
})
export class ContactMessagesModule {}
