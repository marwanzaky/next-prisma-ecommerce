import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	readonly name!: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	readonly slug!: string;

	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	readonly sortOrder!: number;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	readonly parent?: string;
}
