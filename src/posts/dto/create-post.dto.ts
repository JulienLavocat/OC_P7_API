import { IsOptional, MinLength } from "class-validator";

export class CreatePostDto {
	@IsOptional()
	@MinLength(2)
	content?: string;
}
