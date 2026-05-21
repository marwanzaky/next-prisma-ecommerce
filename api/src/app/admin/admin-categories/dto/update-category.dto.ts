import { ApiPropertyOptional } from "@nestjs/swagger";

import { Transform, Type } from "class-transformer";
import {
	IsBoolean,
	IsEmail,
	IsNumber,
	IsOptional,
	IsString,
} from "class-validator";

import { UpdateCategory } from "@repo/database";

export class UpdateCategoryDto implements UpdateCategory {
	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	readonly name?: string;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	readonly slug?: string;

	@ApiPropertyOptional()
	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	readonly sortOrder?: number;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	readonly parentId?: string | null;

	@ApiPropertyOptional()
	@IsBoolean()
	@IsOptional()
	@Transform(({ value }) => value === "true" || value === true)
	readonly isActive?: boolean;
}
