import { IsInt, IsUrl, Max, Min } from "class-validator";

export class KeptImgDto {
	@IsUrl()
	readonly url!: string;

	@IsInt()
	@Min(0)
	@Max(9)
	readonly index!: number;
}
