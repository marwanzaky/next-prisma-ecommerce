import { ApiPropertyOptional } from "@nestjs/swagger";

import { Transform, Type } from "class-transformer";
import {
	IsArray,
	IsBoolean,
	IsNumber,
	IsOptional,
	IsString,
	Max,
	Min,
} from "class-validator";

import { GetAllProducts } from "@repo/database";

export class GetAllProductsDto implements GetAllProducts {
	@ApiPropertyOptional({ type: String, example: "price" })
	@IsOptional()
	readonly sortProperty?: string;

	@ApiPropertyOptional({ type: String, example: "price" })
	@IsOptional()
	readonly sortOrder?: "asc" | "desc";

	@ApiPropertyOptional({ type: String, example: "iPhone" })
	@IsOptional()
	@IsString()
	readonly name?: string;

	@ApiPropertyOptional({ type: [String] })
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	@Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
	readonly excludeIds?: string[];

	@ApiPropertyOptional({ type: Number, example: 499 })
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	readonly minPrice?: number;

	@ApiPropertyOptional({ type: Number, example: 799 })
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	readonly maxPrice?: number;

	@ApiPropertyOptional({ type: Boolean, example: false })
	@IsOptional()
	@IsBoolean()
	@Transform(({ value }) => value === "true")
	readonly featured?: boolean;

	@ApiPropertyOptional({ type: Boolean, example: false })
	@IsOptional()
	@IsBoolean()
	@Transform(({ value }) => value === "true")
	readonly isHero?: boolean;

	@ApiPropertyOptional({
		type: Number,
		example: 4,
	})
	@IsOptional()
	@IsNumber()
	@Min(1)
	@Type(() => Number)
	readonly limit?: number;

	@ApiPropertyOptional({
		type: Number,
		example: 5,
	})
	@IsOptional()
	@IsNumber()
	@Min(1)
	@Max(5)
	@Type(() => Number)
	readonly avgRatings?: number;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	readonly categoryId?: string;
}
