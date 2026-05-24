import { ApiProperty } from "@nestjs/swagger";

import {
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Max,
	Min,
} from "class-validator";

import { CreateProductReview } from "@repo/database";

export class CreateProductReviewDto implements CreateProductReview {
	@ApiProperty()
	@IsString()
	@IsOptional()
	readonly description?: string;

	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	@Min(1)
	@Max(5)
	readonly rating!: number;
}
