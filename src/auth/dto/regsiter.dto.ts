import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
	@ApiProperty()
	@IsEmail()
	email: string;

	@ApiProperty()
	@MinLength(6)
	password: string;

	@ApiProperty()
	@MinLength(2)
	@MaxLength(64)
	displayName: string;

	@ApiProperty()
	@MinLength(2)
	@MaxLength(32)
	firstName: string;

	@ApiProperty()
	@MinLength(2)
	@MaxLength(32)
	lastName: string;
}
