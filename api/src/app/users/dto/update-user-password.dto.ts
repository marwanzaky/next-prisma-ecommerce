import { ApiProperty } from "@nestjs/swagger";

import { IsNotEmpty } from "class-validator";

import { UpdateUserPassword } from "@repo/types";

export class UpdateUserPasswordDto implements UpdateUserPassword {
	@ApiProperty()
	@IsNotEmpty()
	readonly currentPassword!: string;

	@ApiProperty()
	@IsNotEmpty()
	readonly newPassword!: string;
}
