import { Injectable } from "@nestjs/common";
import * as argon2 from "argon2";

@Injectable()
export class PasswordsService {
	hash(value: string): Promise<string> {
		return argon2.hash(value);
	}

	verify(hash: string, plain: string): Promise<boolean> {
		return argon2.verify(hash, plain);
	}
}
