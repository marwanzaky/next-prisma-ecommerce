import { ApiPropertyOptional } from "@nestjs/swagger";

import { Transform, Type } from "class-transformer";
import {
	IsArray,
	IsInt,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";

import { UpdateProduct } from "@repo/database";

import { KeptImgDto } from "@/dtos/kept-img.dto";

import { ProductOptionDto } from "./create-product.dto";
import { UpdateProductVariantDto } from "./update-product-variant.dto";

export class UpdateProductDto implements UpdateProduct {
	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	readonly name?: string;

	@ApiPropertyOptional()
	@IsString()
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

	@ApiPropertyOptional({
		description: "Category id; empty string clears category",
	})
	@IsString()
	@IsOptional()
	@Transform(({ value }: { value: string }) => (value === "" ? null : value))
	readonly categoryId?: string | null;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ProductOptionDto)
	@Transform(({ value }: { value: string }) => JSON.parse(value))
	options!: ProductOptionDto[];

	@ApiPropertyOptional({
		description: "JSON stringified array of UpdateProductVariantDto structures",
		type: [UpdateProductVariantDto],
	})
	@IsArray()
	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => UpdateProductVariantDto)
	@Transform(({ value }: { value: string }) =>
		value ? JSON.parse(value) : undefined,
	)
	readonly variants?: UpdateProductVariantDto[];
}
