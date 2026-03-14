import { ApiProperty } from "@nestjs/swagger";
import { UpdateUserPassword } from "@shared/user.type";
import { IsNotEmpty } from "class-validator";

export class UpdateUserPasswordDto implements UpdateUserPassword {
	@ApiProperty()
	@IsNotEmpty()
	readonly currentPassword!: string;

	@ApiProperty()
	@IsNotEmpty()
	readonly newPassword!: string;
}
