import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../models/user.model";

export class AuthResponse {
	@ApiProperty({ type: User })
	user: User;
	@ApiProperty()
	token: string;
}
