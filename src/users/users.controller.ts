import { Controller, Get, UseGuards } from "@nestjs/common";
import {
	ApiBearerAuth,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from "@nestjs/swagger";
import { User } from "../models/user.model";
import { GetUser } from "../utils/decorators/user.decorator";
import { UserGuard, UserToken } from "../utils/guards/user.guard";
import { UsersService } from "./users.service";

@Controller("users")
@ApiTags("Users")
export class UsersController {
	constructor(private users: UsersService) {}

	@Get()
	@UseGuards(UserGuard)
	@ApiOperation({
		operationId: "getProfile",
	})
	@ApiBearerAuth()
	@ApiOkResponse({ type: User })
	getProfile(@GetUser() user: UserToken): Promise<User> {
		return this.users.getProfile(user.id);
	}
}
