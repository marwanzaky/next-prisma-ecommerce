import { ApiPropertyOptional } from "@nestjs/swagger";

import { Transform, Type } from "class-transformer";
import {
	IsArray,
	IsInt,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";

import { UpdateProductVariant } from "@repo/database";

import { KeptImgDto } from "@/dtos/kept-img.dto";

import { CreateProductVariantDto } from "./create-product-variant.dto";

export class UpdateProductVariantDto
	extends CreateProductVariantDto
	implements UpdateProductVariant
{
	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	readonly variantId?: string;

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
