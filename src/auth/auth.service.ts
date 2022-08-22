import {
	BadRequestException,
	ForbiddenException,
	Injectable,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { PasswordsService } from "../utils/passwords.service";
import { PrismaService } from "../utils/prisma.service";
import { TokensService } from "../utils/tokens.service";
import { LoginDto } from "./dto/login.dto";
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

	async register(dto: RegisterDto): Promise<{ user: User; token: string }> {
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

	async login(dto: LoginDto): Promise<{ user: User; token: string }> {
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
}
