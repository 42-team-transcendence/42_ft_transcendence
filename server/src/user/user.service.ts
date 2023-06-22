import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserService {
	constructor(
        private prisma: PrismaService,
    ) {}

	async getUsers() {
		const users = await this.prisma.user.findMany();
		return (users);
	}
}