import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { Post } from "@prisma/client";
import { unlink } from "fs/promises";
import { Post as PostModel } from "../models/post.model";
import { UserToken } from "../utils/guards/user.guard";
import { PrismaService } from "../utils/prisma.service";
import { UpdatePostDto } from "./dto/update-post.dto";

@Injectable()
export class PostsService {
	constructor(private prisma: PrismaService) {}

	async create(
		user: UserToken,
		content?: string,
		image?: Express.Multer.File,
	): Promise<Post> {
		if (!image && !content)
			throw new BadRequestException(
				"Post must have at least image or text content",
			);

		return await this.prisma.post.create({
			data: {
				content,
				image: image ? image.path : null,
				owner: {
					connect: {
						id: user.id,
					},
				},
			},
		});
	}

	async getFeed(userId: number): Promise<PostModel[]> {
		const rawPosts = await this.prisma.post.findMany({
			orderBy: {
				createdAt: "desc",
			},
			include: {
				owner: {
					select: {
						displayName: true,
						image: true,
						firstName: true,
						lastName: true,
					},
				},
			},
		});

		const likedPosts = await this.prisma.likes.findMany({
			select: {
				postId: true,
			},
			where: {
				postId: { in: rawPosts.map((e) => e.id) },
				userId,
			},
		});

		// Allows for O(1) lookup instead of O(n)
		const likes = new Set(likedPosts.map((e) => e.postId));

		return rawPosts.map((e) =>
			PostModel.fromEntity(
				e,
				likes.has(e.id),
				e.owner.firstName + e.owner.lastName,
				e.owner.displayName,
				e.owner.image,
			),
		);
	}

	async like(postId: number, userId: number): Promise<void> {
		await this.prisma.$transaction(async (prisma) => {
			await prisma.post.update({
				data: {
					likes: { increment: 1 },
				},
				where: {
					id: postId,
				},
			});

			await prisma.likes.create({
				data: {
					userId,
					postId,
				},
			});
		});
	}

	async dislike(postId: number, userId: number): Promise<void> {
		await this.prisma.$transaction(async (prisma) => {
			await prisma.post.update({
				data: {
					likes: { decrement: 1 },
				},
				where: {
					id: postId,
				},
			});

			await prisma.likes.delete({
				where: {
					postId_userId: {
						userId,
						postId,
					},
				},
			});
		});
	}

	async delete(postId: number, userId: number): Promise<PostModel> {
		const post = await this.getPostAndCheckEditPermission(postId, userId);
		const entity = await this.prisma.post.delete({
			where: {
				id: post.id,
			},
		});

		if (entity.image) unlink(entity.image);

		return PostModel.fromEntity(entity);
	}

	async update(
		postId: number,
		userId: number,
		dto: UpdatePostDto,
	): Promise<PostModel> {
		const post = await this.getPostAndCheckEditPermission(postId, userId);

		const entity = await this.prisma.post.update({
			data: {
				content: dto.content,
			},
			where: {
				id: post.id,
			},
		});

		return PostModel.fromEntity(entity);
	}

	async getPostAndCheckEditPermission(postId: number, userId: number) {
		const user = await this.prisma.user.findUniqueOrThrow({
			where: {
				id: userId,
			},
		});
		const post = await this.prisma.post.findUniqueOrThrow({
			where: {
				id: postId,
			},
		});

		if (user.role !== "admin" && user.id !== post.userId)
			throw new UnauthorizedException(
				"You don't have the permission to delete this post",
			);

		return post;
	}
}
