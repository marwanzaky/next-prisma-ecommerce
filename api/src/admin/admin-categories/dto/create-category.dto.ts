import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CreateCategory } from "@shared/category.type";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto implements CreateCategory {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	readonly name!: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	readonly slug!: string;

	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	@Type(() => Number)
	readonly sortOrder!: number;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	readonly parent?: string | null;
}
