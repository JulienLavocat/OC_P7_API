import { Module } from "@nestjs/common";
import { PrismaService } from "../utils/prisma.service";
import { TokensService } from "../utils/tokens.service";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";

@Module({
	controllers: [PostsController],
	providers: [PostsService, PrismaService, TokensService],
})
export class PostsModule {}
