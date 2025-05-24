import { Module } from "@nestjs/common";
import { GeminiService } from "./gemini.service";
import { ChatController } from "./chat.controller";

@Module({
	imports: [],
	controllers: [ChatController],
	providers: [GeminiService],
})
export class ChatModule {}
