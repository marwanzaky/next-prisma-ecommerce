import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { Transform, Type } from "class-transformer";
import {
	ArrayMinSize,
	IsArray,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";

import { CreateProduct } from "@repo/database";

import { CreateProductVariantDto } from "./create-product-variant.dto";

export class ProductOptionDto {
	@IsString()
	@IsNotEmpty()
	name!: string;

	@IsNumber()
	@IsNotEmpty()
	position!: number;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ProductOptionValueDto)
	values!: ProductOptionValueDto[];
}

export class ProductOptionValueDto {
	@IsString()
	@IsNotEmpty()
	value!: string;

	@IsNumber()
	@IsNotEmpty()
	position!: number;
}

export class CreateProductDto implements CreateProduct {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	readonly name!: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	readonly description!: string;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	readonly shortDescription?: string;

	@ApiPropertyOptional()
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	@Transform(({ value }: { value: string }) => JSON.parse(value))
	readonly tags?: string[];

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

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ProductOptionDto)
	@Transform(({ value }: { value: string }) => JSON.parse(value))
	options!: ProductOptionDto[];

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateProductVariantDto)
	@ArrayMinSize(1)
	@Transform(({ value }: { value: string }) => JSON.parse(value))
	variants!: CreateProductVariantDto[];
}
