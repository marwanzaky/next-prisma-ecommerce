import { ApiProperty } from "@nestjs/swagger";

import { IsNotEmpty, IsString } from "class-validator";

import { ResetPassword } from "@repo/database";

export class ResetPasswordDto implements ResetPassword {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	readonly newPassword!: string;
}
