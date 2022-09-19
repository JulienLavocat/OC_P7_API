import {
	BadRequestException,
	ForbiddenException,
	Injectable,
} from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { PasswordsService } from "../utils/passwords.service";
import { PrismaService } from "../utils/prisma.service";
import { TokensService } from "../utils/tokens.service";
import { AuthResponse } from "./dto/auth-response.dto";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenResponse } from "./dto/refresh-token-response.dto";
import { RefreshToken } from "./dto/refresh-token.dto";
import { RegisterDto } from "./dto/regsiter.dto";

const invalidEmailOrPassword = new ForbiddenException(
	"Invalid email or password",
);

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private passwords: PasswordsService,
		private tokens: TokensService,
	) {}

	async register(dto: RegisterDto): Promise<AuthResponse> {
		const password = await this.passwords.hash(dto.password);
		delete dto.password;

		try {
			const user = await this.prisma.$transaction(async (prisma) => {
				const user = await prisma.user.create({
					data: {
						...dto,
						image: `http://dicebear.julienlavocat.me/api/initials/${dto.firstName}%20${dto.lastName}.svg`,
					},
				});
				await this.prisma.password.create({
					data: {
						id: user.id,
						password,
					},
				});

				return user;
			});
			return { user, token: this.tokens.sign(user) };
		} catch (error) {
			if ((error as PrismaClientKnownRequestError).code === "P2002") {
				throw new BadRequestException("Email adress already used");
			}
		}
	}

	async login(dto: LoginDto): Promise<AuthResponse> {
		const user = await this.prisma.user.findUnique({
			where: { email: dto.email },
		});

		if (!user) throw invalidEmailOrPassword;

		const password = await this.prisma.password.findUnique({
			where: {
				id: user.id,
			},
		});

		if (!this.passwords.verify(password.password, dto.password))
			throw invalidEmailOrPassword;

		return { user, token: this.tokens.sign(user) };
	}

	async refreshToken(dto: RefreshToken): Promise<RefreshTokenResponse> {
		return { token: this.tokens.refresh(dto.token) };
	}
}
