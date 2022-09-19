import { IsOptional } from "class-validator";

export class CreatePostDto {
	@IsOptional()
	content?: string;
}
