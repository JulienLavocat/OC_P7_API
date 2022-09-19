import { ApiProperty } from "@nestjs/swagger";

export class RefreshTokenResponse {
	@ApiProperty()
	token: string;
}
