import { Module } from "@nestjs/common";
import { PrismaService } from "../utils/prisma.service";
import { TokensService } from "../utils/tokens.service";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
	providers: [UsersService, PrismaService, TokensService],
	controllers: [UsersController],
})
export class UsersModule {}
