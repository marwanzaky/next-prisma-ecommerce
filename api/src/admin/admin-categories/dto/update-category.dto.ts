import { ApiPropertyOptional } from "@nestjs/swagger";
import { UpdateCategory } from "@shared/category.type";
import { Transform, Type } from "class-transformer";
import {
	IsBoolean,
	IsEmail,
	IsNumber,
	IsOptional,
	IsString,
} from "class-validator";

export class UpdateCategoryDto implements UpdateCategory {
	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	readonly name?: string;

	@ApiPropertyOptional()
	@IsEmail()
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
	readonly parent?: string | null;

	@ApiPropertyOptional()
	@IsBoolean()
	@IsOptional()
	@Transform(({ value }) => value === "true" || value === true)
	readonly isActive?: boolean;
}
