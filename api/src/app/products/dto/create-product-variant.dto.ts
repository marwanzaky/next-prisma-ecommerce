import { ApiProperty } from "@nestjs/swagger";

import { Type } from "class-transformer";
import {
	IsArray,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Min,
	ValidateNested,
} from "class-validator";

import { CreateProductVariant } from "@repo/database";

export class CreateProductVariantDto implements CreateProductVariant {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	readonly title!: string;

	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	@Type(() => Number)
	@Min(0)
	readonly price!: number;

	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	@Type(() => Number)
	@Min(0)
	readonly compareAtPrice!: number;

	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	@Type(() => Number)
	@Min(0)
	readonly stock!: number;

	@ApiProperty()
	@IsString()
	@IsOptional()
	readonly sku?: string;

	@ApiProperty()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => VariantSelectionDto)
	@IsOptional()
	readonly selections!: VariantSelectionDto[];
}

export class VariantSelectionDto {
	@IsString()
	readonly optionName!: string;

	@IsString()
	readonly optionValue!: string;
}
