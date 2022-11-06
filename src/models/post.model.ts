import { ApiProperty } from "@nestjs/swagger";
import { Post as PostEntity } from "@prisma/client";

export class Post {
	@ApiProperty()
	id: number;
	@ApiProperty()
	createdAt: Date;
	@ApiProperty()
	content: string;
	@ApiProperty()
	image: string;
	@ApiProperty()
	likes: number;

	@ApiProperty()
	userId: number;
	@ApiProperty()
	userDisplayId: string;
	@ApiProperty()
	userName: string;
	@ApiProperty()
	userImage: string;
	@ApiProperty()
	hasLiked: boolean;

	static fromEntity(
		entity: PostEntity,
		hasLiked: boolean = false,
		userDisplayId: string = "",
		userName: string = "",
		userImage: string = "",
	): Post {
		return {
			...entity,
			userImage,
			userName,
			userDisplayId,
			hasLiked,
		};
	}
}
