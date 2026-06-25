import { Module } from "@nestjs/common";

import { GeminiModule } from "@/services/gemini/gemini.module";

import { ChatController } from "./chat.controller";
import { PrismaService } from "@/prisma.service";
import { ChatService } from "./chat.service";

@Module({
	imports: [GeminiModule],
	controllers: [ChatController],
	providers: [PrismaService, ChatService],
})
export class ChatModule {}
