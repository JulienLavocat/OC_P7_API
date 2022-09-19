import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { TokensService } from "../tokens.service";
import type { Request } from "express";

export interface UserToken {
	id: number;
}

@Injectable()
export class UserGuard implements CanActivate {
	constructor(private readonly tokens: TokensService) {}

	canActivate(context: ExecutionContext): boolean {
		const req = context.switchToHttp().getRequest() as Request;
		const authorization = (req.headers["authorization"] || "").split(
			"Bearer ",
		);

		if (authorization.length !== 2)
			throw new UnauthorizedException("Missing token");

		const user = this.tokens.verify(authorization[1]);
		if (!user) throw new UnauthorizedException("Invalid token");

		(req as any).user = user;

		return true;
	}
}
