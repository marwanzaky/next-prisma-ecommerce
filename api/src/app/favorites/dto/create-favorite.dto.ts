import { ApiProperty } from "@nestjs/swagger";

import { IsNotEmpty, IsString } from "class-validator";

export class CreateFavoriteDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	readonly productId!: string;
}
