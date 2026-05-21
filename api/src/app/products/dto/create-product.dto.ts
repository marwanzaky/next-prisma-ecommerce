import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

import { CreateProduct } from "@repo/database";

export class CreateProductDto implements CreateProduct {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	readonly name!: string;

	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	@Type(() => Number)
	readonly price!: number;

	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	@Type(() => Number)
	readonly priceCompare!: number;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	readonly description!: string;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	readonly shortDescription?: string;

	@ApiPropertyOptional()
	@IsString({ each: true })
	@IsOptional()
	readonly tags?: string[];

	@ApiPropertyOptional()
	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	readonly stock?: number = 1;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	readonly categoryId?: string | null;

	@ApiProperty({
		type: "string",
		format: "binary",
		isArray: true,
	})
	readonly imgFiles!: File[];
}
