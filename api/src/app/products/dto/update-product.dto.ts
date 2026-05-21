import { ApiPropertyOptional } from "@nestjs/swagger";

import { Transform, Type } from "class-transformer";
import {
	IsArray,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	IsUrl,
	ValidateNested,
} from "class-validator";

import { UpdateProduct } from "@repo/database";

class KeptImgDto {
	@IsUrl()
	readonly url!: string;

	@IsInt()
	readonly index!: number;
}

export class UpdateProductDto implements UpdateProduct {
	@ApiPropertyOptional()
	@IsString()
	@IsNotEmpty()
	@IsOptional()
	readonly name?: string;

	@ApiPropertyOptional()
	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	readonly price?: number;

	@ApiPropertyOptional()
	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	readonly priceCompare?: number;

	@ApiPropertyOptional()
	@IsString()
	@IsNotEmpty()
	@IsOptional()
	readonly description?: string;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	readonly shortDescription?: string;

	@ApiPropertyOptional({
		type: [String],
	})
	@IsOptional()
	@Transform(({ value }: { value: string }) => JSON.parse(value))
	@IsString({ each: true })
	readonly tags?: string[];

	@ApiPropertyOptional()
	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	readonly stock?: number;

	@ApiPropertyOptional({
		description: "Category id; empty string clears category",
	})
	@IsString()
	@IsOptional()
	@Transform(({ value }: { value: string }) => (value === "" ? null : value))
	readonly categoryId?: string | null;

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
