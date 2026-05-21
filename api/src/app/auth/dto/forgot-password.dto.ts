import { ApiProperty } from "@nestjs/swagger";

import { IsEmail, IsNotEmpty } from "class-validator";

import { ForgotPassword } from "@repo/database";

export class ForgotPasswordDto implements ForgotPassword {
	@ApiProperty()
	@IsEmail()
	@IsNotEmpty()
	readonly email!: string;
}
