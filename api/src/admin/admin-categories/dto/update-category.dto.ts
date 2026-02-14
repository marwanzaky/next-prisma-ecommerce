import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateCategoryDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	readonly name!: string;

	@ApiProperty()
	@IsEmail()
	@IsNotEmpty()
	readonly slug!: string;

	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	readonly sortOrder!: number;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	readonly parent!: string | null;
}
