import { ApiProperty } from "@nestjs/swagger";

import { IsNotEmpty, IsString } from "class-validator";

import { ContactMessageStatus } from "@repo/database";

export class UpdateContactMessageStatusDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	readonly status!: ContactMessageStatus;
}
