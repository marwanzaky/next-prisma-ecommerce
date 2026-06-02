import { IsInt, IsUrl } from "class-validator";

export class KeptImgDto {
	@IsUrl()
	readonly url!: string;

	@IsInt()
	readonly index!: number;
}
