import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { IContactMessageStatus } from "@interfaces/contact-message.interface";

export class UpdateContactMessageStatusDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	readonly status!: IContactMessageStatus;
}
