import { ApiPropertyOptional } from "@nestjs/swagger";

import { Transform } from "class-transformer";
import { IsBoolean, IsEmail, IsOptional } from "class-validator";

import { UpdateUser } from "@repo/database";

export class UpdateUserDto implements UpdateUser {
	@ApiPropertyOptional()
	@IsOptional()
	readonly name?: string;

	@ApiPropertyOptional()
	@IsEmail()
	@IsOptional()
	readonly email?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@Transform(({ value }) => value === "true" || value === true)
	@IsBoolean()
	readonly removeAvatar?: boolean;
}
