import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { IContactMessageStatus } from "src/_interfaces/contact-message.interface";

export class UpdateContactMessageStatusDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	readonly status!: IContactMessageStatus;
}
