import { Body, Controller, Post } from "@nestjs/common";
import { User } from "@prisma/client";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/regsiter.dto";

@Controller("auth")
export class AuthController {
	constructor(private auth: AuthService) {}

	@Post("/register")
	register(@Body() dto: RegisterDto): Promise<{ user: User; token: string }> {
		return this.auth.register(dto);
	}

	@Post("login")
	createOne(@Body() dto: LoginDto): Promise<{ user: User; token: string }> {
		return this.auth.login(dto);
	}
}
