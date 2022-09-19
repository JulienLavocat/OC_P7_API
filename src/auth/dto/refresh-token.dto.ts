import { ApiProperty } from "@nestjs/swagger";

export class RefreshToken {
	@ApiProperty()
	token: string;
}
