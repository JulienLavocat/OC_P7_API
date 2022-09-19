import { Injectable } from "@nestjs/common";
import { User } from "../models/user.model";
import { PrismaService } from "../utils/prisma.service";

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) {}

	getProfile(userId: number): Promise<User> {
		return this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		});
	}
}
