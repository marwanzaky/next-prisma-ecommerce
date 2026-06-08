import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { Transform, Type } from "class-transformer";
import {
	IsArray,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Min,
	ValidateNested,
} from "class-validator";

import { CreateProductVariant } from "@repo/database";

import { KeptImgDto } from "@/dtos/kept-img.dto";

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
	@IsNotEmpty()
	readonly sku!: string;

	@ApiProperty()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => VariantSelectionDto)
	@IsOptional()
	readonly selections!: VariantSelectionDto[];

	@ApiPropertyOptional({
		description: "JSON stringified array of { url: string, index: number }",
	})
	@IsOptional()
	@Transform(({ value }: { value: string }) => JSON.parse(value))
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => KeptImgDto)
	readonly keptImgs?: KeptImgDto[];

	@ApiPropertyOptional({
		description: "JSON stringified number[] matching uploaded imgFiles order",
		type: [Number],
	})
	@IsOptional()
	@Transform(({ value }: { value: string }) => JSON.parse(value))
	@IsArray()
	@IsInt({ each: true })
	readonly newImgIndices?: number[];

	@ApiPropertyOptional({
		type: "string",
		format: "binary",
		isArray: true,
	})
	readonly imgFiles?: Express.Multer.File[];
}

export class VariantSelectionDto {
	@IsString()
	readonly optionName!: string;

	@IsString()
	readonly optionValue!: string;
}
