import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SendContactMessageDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	readonly name!: string;

	@ApiProperty()
	@IsEmail()
	@IsNotEmpty()
	readonly email!: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	readonly subject!: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	readonly message!: string;
}
