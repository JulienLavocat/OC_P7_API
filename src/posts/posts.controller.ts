import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Put,
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
import { UpdatePostDto } from "./dto/update-post.dto";
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

	@Patch("/:postId/like")
	@ApiOperation({
		operationId: "like",
		description:
			"This endpoint has no response, it should be treated has an 'event' rather than a request",
	})
	@ApiBearerAuth()
	@UseGuards(UserGuard)
	like(
		@Param("postId", ParseIntPipe) postId: number,
		@GetUser() user: UserToken,
	): Promise<void> {
		return this.posts.like(postId, user.id);
	}

	@Patch("/:postId/dislike")
	@ApiOperation({
		operationId: "dislike",
		description:
			"This endpoint has no response, it should be treated has an 'event' rather than a request",
	})
	@ApiBearerAuth()
	@UseGuards(UserGuard)
	dislike(
		@Param("postId", ParseIntPipe) postId: number,
		@GetUser() user: UserToken,
	): Promise<void> {
		return this.posts.dislike(postId, user.id);
	}

	@Put("/:postId")
	@ApiOperation({
		operationId: "update",
	})
	@ApiBearerAuth()
	@UseGuards(UserGuard)
	update(
		@Param("postId", ParseIntPipe) postId: number,
		@GetUser() user: UserToken,
		@Body() dto: UpdatePostDto,
	): Promise<PostModel> {
		return this.posts.update(postId, user.id, dto);
	}

	@Delete("/:postId")
	@ApiOperation({
		operationId: "delete",
	})
	@ApiBearerAuth()
	@UseGuards(UserGuard)
	delete(
		@Param("postId", ParseIntPipe) postId: number,
		@GetUser() user: UserToken,
	): Promise<PostModel> {
		return this.posts.delete(postId, user.id);
	}
}
