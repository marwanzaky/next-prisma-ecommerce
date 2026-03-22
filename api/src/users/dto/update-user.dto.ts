import { ApiPropertyOptional } from "@nestjs/swagger";
import { UpdateUser } from "@shared/user.type";
import { IsEmail, IsOptional } from "class-validator";

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
	readonly photoUrl?: string;
}
