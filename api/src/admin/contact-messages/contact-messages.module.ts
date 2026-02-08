import { Module } from "@nestjs/common";
import { ContactMessagesService } from "./contact-messages.service";
import { ContactMessagesController } from "./contact-messages.controller";
import { MongooseModule } from "@nestjs/mongoose";
import {
	ContactMessage,
	ContactMessageSchema,
} from "./entities/contact-message.entity";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: ContactMessage.name, schema: ContactMessageSchema },
		]),
	],
	controllers: [ContactMessagesController],
	providers: [ContactMessagesService],
})
export class ContactMessagesModule {}
