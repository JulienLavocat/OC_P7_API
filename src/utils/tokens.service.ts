import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import * as jwt from "jsonwebtoken";

@Injectable()
export class TokensService {
	sign(user: User): string {
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

	verify(token: string): User {
		return jwt.verify(token, process.env.JWT_SECRET) as User;
	}
}
