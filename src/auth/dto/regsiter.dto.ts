import { IsEmail, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
	@IsEmail()
	email: string;

	@MinLength(6)
	password: string;

	@MinLength(2)
	@MaxLength(25)
	displayName: string;

	@MinLength(2)
	@MaxLength(32)
	firstName: string;

	@MinLength(2)
	@MaxLength(32)
	lastName: string;
}
