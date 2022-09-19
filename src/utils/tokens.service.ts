import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { UserToken } from "./guards/user.guard";

@Injectable()
export class TokensService {
	sign(user: UserToken): string {
		return jwt.sign(
			{
				id: user.id,
			},
			process.env.JWT_SECRET,
			{
				expiresIn: "1d",
			},
		);
	}

	verify(token: string): UserToken {
		try {
			return jwt.verify(token, process.env.JWT_SECRET) as UserToken;
		} catch (error) {
			if (error instanceof jwt.JsonWebTokenError)
				throw new UnauthorizedException("Invalid token");
		}
	}

	refresh(token: string): string {
		const data = this.verify(token);
		return this.sign(data);
	}
}
