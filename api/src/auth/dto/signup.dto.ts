import { ApiProperty } from "@nestjs/swagger";
import { CreateUser } from "@shared/user.type";
import { IsEmail, IsNotEmpty } from "class-validator";

export class SignUpDto implements CreateUser {
	@ApiProperty()
	@IsNotEmpty()
	readonly name!: string;

	@ApiProperty()
	@IsEmail()
	readonly email!: string;

	@ApiProperty()
	@IsNotEmpty()
	readonly password!: string;
}
