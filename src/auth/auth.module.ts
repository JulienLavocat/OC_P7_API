import { Module } from "@nestjs/common";
import { PasswordsService } from "../utils/passwords.service";
import { PrismaService } from "../utils/prisma.service";
import { TokensService } from "../utils/tokens.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
	imports: [],
	controllers: [AuthController],
	providers: [AuthService, PrismaService, PasswordsService, TokensService],
})
export class AuthModule {}
