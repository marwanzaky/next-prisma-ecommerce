import { ApiPropertyOptional } from "@nestjs/swagger";

import { IsEmail, IsOptional } from "class-validator";

import { UpdateUser } from "@repo/database";

export class UpdateUserDto implements UpdateUser {
	@ApiPropertyOptional()
	@IsOptional()
	readonly name?: string;

	@ApiPropertyOptional()
	@IsEmail()
	@IsOptional()
	readonly email?: string;
}
