import {
	Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Post,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";
import { diskStorage } from "multer";
import { Post as PostModel } from "../models/post.model";
import { GetUser } from "../utils/decorators/user.decorator";
import { UserGuard, UserToken } from "../utils/guards/user.guard";
import { CreatePostDto } from "./dto/create-post.dto";
import { PostsService } from "./posts.service";

@Controller("posts")
@ApiTags("Posts")
export class PostsController {
	constructor(private posts: PostsService) {}

	@Post()
	@ApiOperation({
		operationId: "create",
	})
	@ApiBearerAuth()
	@ApiConsumes("multipart/form-data")
	@ApiBody({
		schema: {
			type: "object",
			properties: {
				content: { type: "string" },
				image: {
					type: "string",
					format: "binary",
				},
			},
		},
	})
	@UseInterceptors(
		FileInterceptor("image", {
			storage: diskStorage({
				destination: "./images",
			}),
		}),
	)
	@UseGuards(UserGuard)
	createPost(
		@GetUser() user: UserToken,
		@Body() dto: CreatePostDto,
		@UploadedFile() file: Express.Multer.File | undefined,
	): Promise<PostModel> {
		return this.posts.create(user, dto.content, file) as any;
	}

	@Get()
	@ApiOperation({
		operationId: "getFeed",
	})
	@ApiResponse({ status: 200, type: [PostModel] })
	@ApiBearerAuth()
	@UseGuards(UserGuard)
	getFeed(@GetUser() user: UserToken): Promise<PostModel[]> {
		return this.posts.getFeed(user.id);
	}

	@Get("/:postId/like")
	@ApiOperation({
		operationId: "like",
	})
	@ApiBearerAuth()
	@UseGuards(UserGuard)
	like(
		@Param("postId", ParseIntPipe) postId: number,
		@GetUser() user: UserToken,
	): Promise<void> {
		return this.posts.like(postId, user.id);
	}

	@Get("/:postId/dislike")
	@ApiOperation({
		operationId: "dislike",
	})
	@ApiBearerAuth()
	@UseGuards(UserGuard)
	dislike(
		@Param("postId", ParseIntPipe) postId: number,
		@GetUser() user: UserToken,
	): Promise<void> {
		return this.posts.dislike(postId, user.id);
	}
}
