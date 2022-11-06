import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UpdatePostDto {
	@ApiProperty()
	@IsOptional()
	content?: string;
}
