import { Module } from "@nestjs/common";

import { CloudinaryModule } from "@/services/cloudinary/cloudinary.module";

import { PrismaService } from "@/prisma.service";

import { UsersController } from "./users.controller";

import { AuthModule } from "../auth/auth.module";

@Module({
	imports: [CloudinaryModule, AuthModule],
	controllers: [UsersController],
	providers: [PrismaService],
})
export class UsersModule {}
