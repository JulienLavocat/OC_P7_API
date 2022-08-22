import { ApiProperty } from "@nestjs/swagger";

export class User {
	@ApiProperty()
	id: number;

	@ApiProperty()
	email: string;

	@ApiProperty()
	firstName: string;

	@ApiProperty()
	lastName: string;

	@ApiProperty()
	displayName: string;

	@ApiProperty()
	image: string;

	@ApiProperty()
	role: string;
}
