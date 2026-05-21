import { Module } from "@nestjs/common";

import { CloudinaryModule } from "@/services/cloudinary/cloudinary.module";
import { TranslationModule } from "@/services/translation/translation.module";

import { PrismaService } from "@/prisma.service";

import { AdminCategoriesController } from "./admin-categories.controller";

@Module({
	imports: [CloudinaryModule, TranslationModule],
	providers: [PrismaService],
	controllers: [AdminCategoriesController],
})
export class AdminCategoriesModule {}
