import { ApiProperty } from "@nestjs/swagger";
import { ChatSendMessage } from "@repo/types";
import { Type } from "class-transformer";

import {
	IsArray,
	IsIn,
	IsNotEmpty,
	IsString,
	ValidateNested,
} from "class-validator";

export class ChatHistoryItemDto {
	@ApiProperty({ example: "user", enum: ["user", "model"] })
	@IsIn(["user", "model"])
	readonly role!: "user" | "model";

	@ApiProperty({ example: [{ text: "Hello!" }] })
	@IsArray()
	readonly parts!: Array<{ text: string }>;
}

export class ChatSendMessageDto implements ChatSendMessage {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	readonly message!: string;

	@ApiProperty({
		type: [ChatHistoryItemDto],
		description:
			"The exact conversational log history formatted for the Gemini API structure.",
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ChatHistoryItemDto)
	readonly previousChat!: ChatHistoryItemDto[];
}
