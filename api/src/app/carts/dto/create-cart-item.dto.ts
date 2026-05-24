import { ApiProperty } from "@nestjs/swagger";

import { IsNumber, IsOptional, Min } from "class-validator";

export class CreateCartItemDto {
	@ApiProperty()
	@IsNumber()
	@Min(1)
	@IsOptional()
	readonly quantity?: number;
}
