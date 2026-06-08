import { ApiPropertyOptional } from "@nestjs/swagger";

import { IsOptional, IsString } from "class-validator";

import { UpdateProductVariant } from "@repo/database";

import { CreateProductVariantDto } from "./create-product-variant.dto";

export class UpdateProductVariantDto
	extends CreateProductVariantDto
	implements UpdateProductVariant
{
	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	readonly variantId?: string;
}
