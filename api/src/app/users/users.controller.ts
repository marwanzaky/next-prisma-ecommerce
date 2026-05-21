import {
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Patch,
	Post,
	Req,
	UnauthorizedException,
	UploadedFile,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";

import { compare, hash } from "bcryptjs";

import { Prisma, Product } from "@repo/database";
import { PublicUser, User } from "@repo/database";

import { Public } from "@/app/auth/auth.guard";

import { CloudinaryService } from "@/services/cloudinary/cloudinary.service";

import { Roles } from "@/decorators/roles.decorator";
import { PrismaService } from "@/prisma.service";
import { IRequest } from "@/types/request.type";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateUserPasswordDto } from "./dto/update-user-password.dto";

import { AuthService } from "../auth/auth.service";

export const userPublicSelect: Prisma.UserSelect = {
	id: true,
	role: true,
	name: true,
	email: true,
	avatarUrl: true,
};

@Controller("users")
@ApiBearerAuth("Authorization")
export class UsersController {
	constructor(
		private readonly prisma: PrismaService,
		private readonly cloudinaryService: CloudinaryService,
		private readonly authService: AuthService,
	) {}

	@Get("/me")
	@ApiOperation({
		summary: "Get the authenticated user's info",
	})
	async getMe(@Req() request: IRequest): Promise<PublicUser | null> {
		return this.prisma.user.findFirst({
			where: { id: request.user.id },
			select: userPublicSelect,
		});
	}

	@Get("/me/products")
	@ApiOperation({
		summary: "Get all products of the authenticated user",
	})
	async getMeProducts(@Req() request: IRequest): Promise<Product[]> {
		return this.prisma.product.findMany({
			where: {
				userId: request.user.id,
			},
			orderBy: {
				createdAt: "asc",
			},
		});
	}

	@Patch("/updateMe")
	@ApiOperation({
		summary: "Update the authenticated user's info",
	})
	@UseInterceptors(FileInterceptor("avatarFile"))
	async updateMe(
		@Req() request: IRequest,
		@Body() updateUserDto: UpdateUserDto,
		@UploadedFile() avatarFile?: Express.Multer.File,
	): Promise<PublicUser> {
		let avatarUrl: string | null = null;

		if (avatarFile) {
			avatarUrl = (await this.cloudinaryService.uploadFile(avatarFile)) || null;
		}

		return this.prisma.user.update({
			where: {
				id: request.user.id,
			},
			data: {
				name: updateUserDto.name,
				email: updateUserDto.email,
				avatarUrl,
			},
			select: userPublicSelect,
		});
	}

	@Delete("/deleteMe")
	@ApiOperation({
		summary: "Delete the authenticated user's account",
	})
	async deleteMe(@Req() request: IRequest): Promise<PublicUser> {
		return this.prisma.user.delete({
			where: {
				id: request.user.id,
			},
			select: userPublicSelect,
		});
	}

	@Patch("/updateMyPassword")
	@ApiOperation({
		summary: "Update the authenticated user's password",
	})
	async updateMyPassword(
		@Req() request: IRequest,
		@Body() updateUserPasswordDto: UpdateUserPasswordDto,
	) {
		const { currentPassword, newPassword } = updateUserPasswordDto;

		const user = await this.prisma.user.findFirst({
			where: { id: request.user.id },
		});

		if (!user) {
			throw new NotFoundException("Could not find the user");
		}

		const passwordMatch = await compare(currentPassword, user.password);

		if (passwordMatch === false) {
			throw new UnauthorizedException("Incorrect current password");
		}

		const hashedPassword = await hash(newPassword, 12);

		await this.prisma.user.update({
			where: { id: request.user.id },
			data: {
				password: hashedPassword,
				passwordChangedAt: new Date(Date.now() - 1000),
			},
		});

		return {
			token: await this.authService.createAccessToken(user.id, user.role),
		};
	}

	@Get("public/:id")
	@Public()
	@ApiOperation({
		summary: "Get a specific public user",
	})
	getPublicUser(@Param("id") id: string): Promise<PublicUser | null> {
		return this.prisma.user.findFirst({
			where: { id },
			select: userPublicSelect,
		});
	}

	@Get()
	@Roles("admin")
	@ApiOperation({
		summary: "Get all users (admin-only)",
	})
	getAllUsers(): Promise<User[]> {
		return this.prisma.user.findMany();
	}

	@Post()
	@Roles("admin")
	@ApiOperation({
		summary: "Create a new user (admin-only)",
	})
	async createUsers(@Body() createUserDto: CreateUserDto): Promise<User> {
		const { name, email, password } = createUserDto;
		const hashedPassword = await hash(password, 12);

		return this.prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
			},
		});
	}

	@Get(":id")
	@Roles("admin")
	@ApiOperation({
		summary: "Get a specific user (admin-only)",
	})
	getUser(@Param("id") id: string): Promise<User | null> {
		return this.prisma.user.findFirst({
			where: {
				id,
			},
		});
	}

	@Patch(":id")
	@Roles("admin")
	@ApiOperation({
		summary: "Update a specific user (admin-only)",
	})
	updateUser(
		@Param("id") id: string,
		@Body() updateUserDto: UpdateUserDto,
	): Promise<User> {
		return this.prisma.user.update({
			where: { id },
			data: updateUserDto,
		});
	}

	@Delete(":id")
	@Roles("admin")
	@ApiOperation({
		summary: "Remove a specific user (admin-only)",
	})
	deleteUser(@Param("id") id: string): Promise<User> {
		return this.prisma.user.delete({
			where: { id },
		});
	}
}
