import { ApiPropertyOptional } from "@nestjs/swagger";

import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

import { UpdateProduct } from "@repo/database";

export class UpdateProductReviewDto implements UpdateProduct {
	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	readonly description?: string;

	@ApiPropertyOptional()
	@IsNumber()
	@IsOptional()
	@Min(1)
	@Max(5)
	readonly rating!: number;
}
