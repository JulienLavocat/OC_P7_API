import { ApiProperty } from "@nestjs/swagger";

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
}
