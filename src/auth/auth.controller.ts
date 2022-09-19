import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { AuthResponse } from "./dto/auth-response.dto";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenResponse } from "./dto/refresh-token-response.dto";
import { RegisterDto } from "./dto/regsiter.dto";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
	constructor(private auth: AuthService) {}

	@Post("/register")
	@ApiResponse({
		status: 201,
		type: AuthResponse,
	})
	@ApiOperation({ operationId: "register" })
	register(@Body() dto: RegisterDto): Promise<AuthResponse> {
		return this.auth.register(dto);
	}

	@Post("login")
	@ApiOperation({ operationId: "login" })
	@ApiResponse({
		status: 201,
		type: AuthResponse,
	})
	createOne(@Body() dto: LoginDto): Promise<AuthResponse> {
		return this.auth.login(dto);
	}

	@Post("/refresh")
	@ApiOperation({ operationId: "refreshToken" })
	@ApiResponse({
		status: 201,
		type: RefreshTokenResponse,
	})
	refreshToken(
		@Body() dto: RefreshTokenResponse,
	): Promise<RefreshTokenResponse> {
		return this.auth.refreshToken(dto);
	}
}
